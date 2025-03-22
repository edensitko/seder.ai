<div align="center">

# 🧠 Seder.ai 🧠

### AI-Powered Thought Organization with Docker


*Bringing clarity to your thoughts in the digital age*

</div>

---

## ✨ Overview

**Seder.ai** is an innovative Docker-based web application designed to help you organize your thoughts through AI-powered interactions. The platform provides a modern, interactive way to capture, categorize, and connect your ideas, making it easier to maintain clarity and focus in your thinking process.

## 🚀 Features

- **📚 Smart Categorization**: Automatically organize your thoughts into meaningful categories
- **🤖 AI-Powered Insights**: Generate connections and insights between your ideas
- **⚙️ Customizable Experience**: Tailor the organization system to your personal thinking style
- **🌐 Multilingual Support**: Available in multiple languages to accommodate diverse users
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🐳 Docker Integration**: Easy deployment and scaling with containerization

## 🛠️ Technology Stack

<div align="center">

**Docker** • **React** • **TypeScript** • **Tailwind CSS** • **Node.js** • **Express** • **OpenAI**

</div>

## 🚦 Getting Started with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/edensitko/seder.ai.git
   cd seder.ai
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   # For production
   docker-compose up -d
   
   # For development with hot reloading
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Production: http://localhost:80
   - Development: http://localhost:5173

### Docker Helper Script

We've included a helper script to simplify Docker operations:

```bash
# Make the script executable (only needed once)
chmod +x docker-start.sh

# Start in development mode (with hot reloading)
./docker-start.sh dev

# Start in production mode
./docker-start.sh prod

# Build the production Docker image
./docker-start.sh build

# Stop running containers
./docker-start.sh stop
```

### Docker Configuration Files

- `Dockerfile` - For building the production image
- `Dockerfile.dev` - For development with hot reloading
- `docker-compose.yml` - Docker Compose configuration for production
- `docker-compose.dev.yml` - Docker Compose configuration for development
- `docker-start.sh` - Helper script for running Docker commands
- `nginx.conf` - Nginx configuration for the production environment
- `.dockerignore` - Files to exclude from Docker builds

## 📂 Project Structure

```
seder.ai/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # CSS and styling
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── docker/            # Docker configuration files
├── .env.example       # Example environment variables
├── docker-compose.yml # Production Docker Compose config
└── README.md          # Project documentation
```

## 🔧 Local Development (Without Docker)

If you prefer to develop without Docker:

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🤝 Contributing

We welcome contributions to Seder.ai! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

<details>
<summary>📋 Contribution Guidelines</summary>
<br>

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Write comments for complex logic

### Commit Messages
- Use clear and meaningful commit messages
- Reference issue numbers when applicable

### Testing
- Add tests for new features
- Ensure all tests pass before submitting a PR
</details>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Project Maintainer**: Eden Sitkovetsky
- **GitHub**: edensitko

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Seder.ai
- Special thanks to our users for their valuable feedback
- Inspired by the need for better thought organization tools in our digital world

---

<div align="center">

### Made with ❤️ for clearer thinking

</div>
