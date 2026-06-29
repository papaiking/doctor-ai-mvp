#
# Copyright (c) 2024–2026, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

import os

from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.serializers.protobuf import ProtobufFrameSerializer
from pipecat.services.google.gemini_live.llm import GeminiLiveLLMService
from pipecat.transports.websocket.server import (
    WebsocketServerParams,
    WebsocketServerTransport,
)

SYSTEM_INSTRUCTION = f"""
"Bạn là trợ lý bác sỹ AI, phát âm tên đúng là: Gi ni xi.
Mục tiêu của bạn là hỗ trợ người dùng về chăm sóc sức khỏe, bao gồm:
- Tư vấn liên quan đến sức khỏe của họ - mang tính tham khảo, không phải tư vấn y tế chuyên sâu
- Hỗ trợ đặt lịch khám bệnh tại các bệnh viện và phòng khám
- Hỗ trợ đặt hàng thuốc, thiết bị y tế, và các sản phẩm y tế khác tại các nhà cung cấp uy tín trên toàn quốc
- Hỗ trợ liên hệ tới dịch vụ hỗ trợ khẩn cấp khi có yêu cầu

Giao tiếp khách hàng bằng giọng nói nên không được sử dụng ký tự đặc biệt trong câu trả lời.
Ngôn ngữ giao tiếp hoàn toàn bằng tiếng Việt.
Hãy phản hồi ngắn gọn và hữu ích đúng với điều người dùng hỏi. Giữ câu trả lời thật súc tích, tối đa một hoặc hai câu.

Thông tin về bác sỹ khám bệnh tại Bệnh viện ĐH Y Hà nội:
- Tên: Nguyễn Hà Phương
- Chuyên khoa: Tim mạch
- Trình độ: Tiến sỹ tim mạch
- Giờ làm việc: Từ 8h đến 17h
- Địa chỉ: Số 1, Tôn Thất Tùng, Hà nội
- Số điện thoại: 0909090909
"""


async def run_bot_websocket_server():
    ws_transport = WebsocketServerTransport(
        params=WebsocketServerParams(
            serializer=ProtobufFrameSerializer(),
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            session_timeout=60 * 3,  # 3 minutes
        )
    )

    llm = GeminiLiveLLMService(
        api_key=os.getenv("GOOGLE_API_KEY"),
        settings=GeminiLiveLLMService.Settings(
            voice="Puck",  # Aoede, Charon, Fenrir, Kore, Puck
            system_instruction=SYSTEM_INSTRUCTION,
        ),
    )

    context = LLMContext(
        [
            {
                "role": "user",
                "content": "Start by greeting the user warmly and introducing yourself.",
            }
        ],
    )
    user_aggregator, assistant_aggregator = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(
            vad_analyzer=SileroVADAnalyzer(),
        ),
    )

    pipeline = Pipeline(
        [
            ws_transport.input(),
            user_aggregator,
            llm,  # LLM
            ws_transport.output(),
            assistant_aggregator,
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
    )

    @task.rtvi.event_handler("on_client_ready")
    async def on_client_ready(rtvi):
        logger.info("Pipecat client ready.")
        # Kick off the conversation.
        await task.queue_frames([LLMRunFrame()])

    @ws_transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info("Pipecat Client connected")

    @ws_transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("Pipecat Client disconnected")
        await task.cancel()

    @ws_transport.event_handler("on_session_timeout")
    async def on_session_timeout(transport, client):
        logger.info(f"Entering in timeout for {client.remote_address}")
        await task.cancel()

    runner = PipelineRunner()

    await runner.run(task)
