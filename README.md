# Video Streaming App with Microservices Architecture

This repository contains a microservices-based architecture for a video streaming app. The application is built using Node.js, Docker, Docker Compose, and MinIO for blob storage. The two primary microservices are:

- **Video Streaming Service**: Handles video streaming functionality, including video upload, processing, and streaming.
- **S3 Blob Storage Service**: A scalable object storage service (AWS S3) to store and retrieve video files.

## Tech Stack

- **Node.js**: JavaScript runtime environment for building server-side applications.
- **Docker**: Containerization platform to create, deploy, and run applications in containers.
- **Docker Compose**: A tool to define and manage multi-container Docker applications.
- **S3**: High-performance, distributed object storage, managed by AWS
- **MongoDB** - A high-performance NoSQL Database.

## Services

### 1. **Video Streaming Service**
The video streaming service provides endpoints for uploading, processing, and streaming video content. It communicates with the MinIO service to store and retrieve video files.

#### Features:
- Upload videos to MinIO blob storage.
- Stream videos to clients.
- Support for multiple video formats.

### 2. **S3 Blob Storage Service**
AWS S3 is used to provide scalable object storage for storing video files, allowing easy integration with the video streaming service.

#### Features:
- Object storage compatible with S3 APIs.
- Scalable storage for video files.
- Supports file uploads and retrievals.

## Getting Started

To run the application locally, follow these steps:

### Prerequisites
- **Docker**: Make sure you have Docker installed on your machine.
- **Docker Compose**: Ensure Docker Compose is also installed.

You can check Docker and Docker Compose installation by running:
```bash
docker --version
docker-compose --version
