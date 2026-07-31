# Doctor Genie — Landing Page

This is the standalone marketing landing page for the Doctor Genie AI Healthcare Ecosystem.

## Tech Stack
- **Framework:** Vanilla HTML, CSS, JavaScript (No React, No Next.js)
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite v6
- **Form Handling:** PHP (using PHPMailer for SMTP)

## Local Development

### Requirements
- Node.js (version 20 or higher recommended, e.g., v22.22.3)
- npm

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Note: The Vite dev server handles the frontend (HTML/CSS/JS) with hot-reloading. However, submitting the contact form will not work through Vite because it relies on a PHP backend (`api/contact.php`).*

## Configuration (Contact Form)

To enable email notifications, you must configure the SMTP settings in `api/contact.php`.

Open `api/contact.php` and update the following lines with your actual Gmail account and an **App Password**:

```php
// Server settings for Gmail SMTP
$mail->Username   = 'YOUR_GMAIL_ACCOUNT@gmail.com'; 
$mail->Password   = 'YOUR_GMAIL_APP_PASSWORD'; 
```
*(Note: You must generate an App Password in your Google Account's 2-Step Verification settings. Standard passwords will not work.)*

## Deployment (Nginx + PHP)

To deploy this landing page to a production environment using Nginx and PHP-FPM:

### 1. Install Nginx and PHP FastCGI (PHP-FPM)

If you haven't installed them yet, you can do so using your server's package manager.

**For Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx php-fpm
```
*(This will install the default PHP version for your OS, usually 8.1 or newer. Make sure to note the version for the Nginx config, e.g., `php8.1-fpm`)*

**For CentOS/RHEL:**
```bash
sudo yum install epel-release
sudo yum install nginx php-fpm
sudo systemctl enable --now nginx php-fpm
```

### 2. Build the static assets:
   ```bash
   npm run build
   ```
   This generates the optimized static files in the `dist/` directory.

### 3. Prepare the deployment package:
   - Copy the contents of the `dist/` directory to your web server's document root (e.g., `/var/www/doctor-genie`).
   - Copy the `api/` folder directly into the document root alongside the `dist` files.

### 4. Nginx Configuration:
   Configure your Nginx server block to serve the static HTML files and proxy `.php` requests to PHP-FPM.

   Example `nginx.conf`:
   ```nginx
   server {
       listen 80;
       server_name business.gnixy.com; # Replace with your domain
       root /var/www/doctor-genie;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }

       # Pass PHP scripts to FastCGI server
       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust PHP version
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }

       # Deny access to .htaccess files
       location ~ /\.ht {
           deny all;
       }
   }
   ```
   Make sure PHP-FPM is installed and running on your server.
