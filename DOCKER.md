# Running Eventra in Docker

This guide explains how to build, run, and manage the **Eventra** platform using Docker and Docker Compose. 

By using Docker, you do not need to have PHP, Composer, Node.js, or MySQL installed locally on your host machine.

---

## Prerequisites
Ensure you have the following installed on your system:
1. **Docker Desktop** (or Docker Engine with Docker Compose CLI)
2. **Git**

---

## 1. Quick Start

To build and start the entire stack in the background, run the following command in the project root directory:

```bash
docker compose up --build -d
```

This will automatically:
1. Spin up a MySQL 8.0 database container (`eventra-db`) and initialize the database.
2. Build and start the Laravel API backend container (`eventra-backend`), running `composer install`, linking public storage, building static assets, running migrations, and seeding the database.
3. Build and start the React Vite frontend container (`eventra-frontend`) running the dev server.

---

## 2. Accessing the Application

Once the containers are fully started, you can access the platform at:

- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Laravel Admin Dashboard**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **REST API Endpoint**: [http://localhost:8000/api](http://localhost:8000/api)

---

## 3. Useful Commands

### Check Container Status
To see which containers are currently running and their health:
```bash
docker compose ps
```

### View Live Logs
To monitor the logs of all services in real time:
```bash
docker compose logs -f
```

To view logs for a specific service (e.g., the backend):
```bash
docker compose logs -f backend
```

### Stop the Application
To stop all running containers without losing database data:
```bash
docker compose down
```

To stop all containers and delete database data (resets database completely):
```bash
docker compose down -v
```

### Run Artisan Commands inside the Backend
You can run any Laravel artisan commands directly in the running backend container:
- **Run migrations/seeders manually**:
  ```bash
  docker compose exec backend php artisan migrate:refresh --seed
  ```
- **Clear application cache**:
  ```bash
  docker compose exec backend php artisan cache:clear
  ```
- **Run tests**:
  ```bash
  docker compose exec backend php artisan test
  ```

---

## 4. Troubleshooting

### Port Collision
If you get an error that ports `8000`, `5173`, or `3306` are already in use, make sure you stop local services like Laragon, Apache, MySQL, or other development servers running on your machine.

### Database Connection Issues
The backend container is configured to talk to the database using `DB_HOST=db` (defined as environment variables in `docker-compose.yml`). The Docker environment automatically overrides any local `.env` settings inside the container.
