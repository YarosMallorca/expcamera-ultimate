let deviceListElement = document.getElementById("device-list")

window.addEventListener('load', (event) => {
    fetchDevices(); // Fetch devices once on load
    setInterval(fetchDevices, 5000); // Fetch devices every 5 seconds
});


function fetchDevices() {
    fetch('http://localhost:3000/devices')
        .then(response => response.json())
        .then(data => {
            deviceListElement.innerHTML = "";
            data["devices"].forEach((device) => deviceListElement.innerHTML += listTile(device));

        })
        .catch(err => console.error(err));
}

function deleteDevice(device) {
    console.log(device)
    fetch('http://localhost:3000/devices', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
    })
        .then(response => {
            if (response.ok) {
                console.log('Device deleted successfully');
                // Optionally refresh the device list or update the UI here
                fetchDevices(); // Fetch the updated device list
            } else {
                console.error('Failed to delete device:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function listTile(deviceJson) {
    const url = `http://${deviceJson["username"]}:${deviceJson["password"]}@${deviceJson["ip"]}:${deviceJson["port"]}`;
    return `
    <div class="flex flex-col md:flex-row justify-between items-center space-4 bg-zinc-700 rounded-lg w-full p-4">
        <section class="flex flex-col">
            <a href=${url} target="_blank" class="font-bold text-blue-300 hover:text-blue-400">${deviceJson["ip"]}:${deviceJson["port"]}</a>
        </section>
        <div class="flex">
            <section class="flex flex-col">
                <div class="flex items-center">
                    <p><b>Usuario:</b> ${deviceJson["username"]}</p>
                    <button onclick="copyToClipboard('${deviceJson["username"]}')" class="ml-2 text-sm text-blue-400 hover:text-blue-500">
                        Copiar
                    </button>
                </div>
                <div class="flex items-center">
                    <p><b>Contraseña:</b> ${deviceJson["password"]}</p>
                    <button onclick="copyToClipboard('${deviceJson["password"]}')" class="ml-2 text-blue-400">
                        Copiar
                    </button>
                </div>
            </section>
            <button onclick='deleteDevice(${JSON.stringify(deviceJson)})' class="ml-2 text-sm text-red-400 hover:text-red-500 pl-8">
                Borrar
            </button>
        </div>
    </div>
    `;
}

// JavaScript function to copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
