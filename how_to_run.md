# Prerequisites
- Docker Desktop installed
- Kubernetes enabled in Docker Desktop
- kubectl installed

>make sure .env contains groq api key
# if change in .env run this (no rebuild needed)
kubectl delete secret resumeai-secret
kubectl create secret generic resumeai-secret --from-env-file=.env
kubectl delete pod -l app=backend

# To run the project using kubernetes-
cd Resume-analyser

>Verify Kubernetes cluster
kubectl cluster-info

>IF code change, rebuild images
docker build -t resumeai-frontend ./frontend
docker build -t resumeai-backend ./backend

>Deploy application
kubectl apply -f kubernetes/

>Check pods
kubectl get pods

>Expose frontend (Terminal 1)
kubectl port-forward service/frontend-service 3000:80

>Expose backend (Open another terminal)
kubectl port-forward service/backend 8000:8000

>frontend at
http://localhost:3000

>backend at
http://localhost:8000/docs



