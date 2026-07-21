// Point this at your deployed RUMA-BACKEND instance (see Render.yaml in that repo),
// or http://<your-lan-ip>:8080 for a local Go server run with `go run cmd/server/main.go`.
// localhost does not work from a physical device/simulator over the network.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
