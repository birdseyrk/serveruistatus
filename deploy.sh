#!/bin/bash

ansible-playbook -i /local/serveruistatus/ansible/inventory.txt /local/serveruistatus/ansible/remove-app-container.yaml;
sleep 10;
ansible-playbook -i /local/serveruistatus/ansible/inventory.txt /local/serveruistatus/ansible/remove-cleanup-local-image.yaml;
sleep 5;
rm -rf /local/serveruistatus/docker/dist
sleep 5
ansible-playbook -i /local/serveruistatus/ansible/inventory.txt /local/serveruistatus/ansible/buildandpushimage.yaml;
sleep 5;
/usr/bin/ansible-playbook -i /local/serveruistatus/ansible/inventory.txt /local/serveruistatus/ansible/delete-k8s-apps.yaml --extra-vars "myhost=k8s myfile=/local/serveruistatus/kubernetes/ui-deployment.yaml"
sleep 5;
/usr/bin/ansible-playbook -i /local/serveruistatus/ansible/inventory.txt /local/serveruistatus/ansible/apply-k8s-apps.yaml --extra-vars "myhost=k8s myfile=/local/serveruistatus/kubernetes/ui-deployment.yaml"
