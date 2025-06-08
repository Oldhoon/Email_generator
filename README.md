**MailBot: AI-Powered Email Reply Assistant**

MailBot is a combined **Chrome extension** and **Spring Boot** backend that automatically generates professional email replies in Gmail using Google Gemini AI. The extension injects an "AI Reply" button into Gmail's compose toolbar. When clicked, it sends the selected email content and tone preference to the backend, which calls the Gemini API, processes the response, and returns a suggested reply.

---

## 🏗️ Project Architecture

```
[Gmail (Chrome)] <– HTTPS –> [Nginx (HTTPS, port 443)] → [Spring Boot App (HTTP, port 8080)] → [Gemini AI API]
```

1. **Chrome Extension**

   * **Manifest V3** (`manifest.json`) configures content scripts and host permissions  
   * **content.js** watches for Gmail compose windows, injects an AI Reply button, captures email body, and issues a POST request to the backend 

2. **Backend (Spring Boot)**

   * **EmailGeneratorApplication**: application entry point 
   * **EmailRequest**: DTO representing incoming JSON (emailContent & tone) 
   * **EmailGeneratorService**: calls Gemini API using Spring WebClient, parses JSON response via Jackson 
   * **EmailGeneratorController**: REST endpoint `/api/email/generate` handling POST requests, with CORS enabled 

3. **Deployment**

   * **AWS EC2** instance running Amazon Linux 2
   * **Nginx** as HTTPS reverse proxy with self-signed or Let’s Encrypt certificate
   * **Java 21 (Corretto)** installed manually under `/opt/corretto`

---

## 🛠️ Tech Stack

* **Frontend**: Chrome Extension (Manifest V3), JavaScript, DOM API, MutationObserver, `fetch`
* **Backend**: Java 21, Spring Boot (WebFlux for WebClient), Lombok, Jackson, Maven wrapper (`mvnw`)
* **AI API**: Google Gemini Generative Language API
* **Deployment**: AWS EC2 (Amazon Linux 2), Nginx, self-signed/Let’s Encrypt SSL

---

## ⚙️ Prerequisites

* **Java 21** installed on your local machine (for backend build)
* **Maven** (via `mvnw`) or **Gradle** wrapper available
* **Google Cloud API Key** with access to Gemini API
* **AWS account** for EC2 and optional domain
* **Chrome** browser (for extension) with Developer Mode enabled

---

## 📥 Installation & Setup

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mailbot.git
cd mailbot/backend

# Build the executable JAR
./mvnw clean package
# or: ./gradlew bootJar
```

#### Configure Environment Variables

Create an `application.properties` under `src/main/resources` or in an external `config/` directory:

```properties
spring.application.name=email-generator
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=
gemini.api.key=${GEMINI_API_KEY}
```

Then export your key in the shell:

```bash
export GEMINI_API_KEY=YOUR_GOOGLE_API_KEY
```

#### Run the Backend

```bash
java -jar target/email-gen-0.0.1-SNAPSHOT.jar
```

The service listens on **port 8080** by default.

### 2. Frontend (Chrome Extension) Setup

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked** and select the extension folder containing:

   * `manifest.json`  
   * `content.js` 
   * `content.css` (if present)
   * `icons/` directory
4. Ensure **host\_permissions** include your backend URL:

   ```json
   "host_permissions": [
     "https://your-domain-or-ip/*",
     "*://mail.google.com/*"
   ]
   ```

---

## 🚀 Usage

1. Navigate to Gmail in Chrome and compose a new email.
2. Click the **AI Reply** button in the toolbar.
3. The extension captures the email content, calls the backend, and inserts the generated reply.

---

## 🔧 Deployment (AWS EC2 + Nginx)

1. **Provision EC2**: Ubuntu or Amazon Linux 2 instance, open ports **22**, **80**, **443**
2. **Install Java 21**: download Corretto, extract to `/opt/corretto`, configure `alternatives`
3. **Install Nginx** and generate a certificate (self-signed or Let’s Encrypt)
4. **Configure Nginx** to proxy `HTTPS 443` → `localhost:8080`
5. **Run** the Spring Boot JAR as a background service (via `screen`, `systemd`, or `tmux`)

---

## 🗂️ File Structure

```
mailbot/
├── backend/
│   ├── src/main/java/com/email_gen/
│   │   ├── EmailGeneratorApplication.java
│   │   ├── EmailGeneratorController.java
│   │   ├── EmailGeneratorService.java
│   │   └── EmailRequest.java
│   ├── src/main/resources/application.properties
│   └── pom.xml 
├── extension/
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   ├── icons/
│   └── ...
└── README.md
```

credits to : 
EmbarkX | Learn Programming 
