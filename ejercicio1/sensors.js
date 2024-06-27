class Sensor {
    constructor(id, name, type, value, unit, updated_at) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.updated_at = updated_at;
    }
    // Se solicita 'temperature', 'humidity', 'pressure',En la clase SensorManage
    // usa temperatura, humedad, presion, - Lo dejaremo en Español para evitar errores en la correcion del codigo
    set updateValue(newValue) {
        if(['temperatura', 'humedad', 'presion'].includes(this.type) ){
            this.value = newValue;
            this.updated_at = new Date().toISOString();
        }else {
            console.error('Tipo de sensor no permitido: ${this.type}');
        }
    }
}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }
/*La función `loadSensors` es un método de la clase `SensorManager`. 
 Este método se encarga de cargar los datos de los sensores desde un archivo 
 JSON ubicado en una URL especificada y luego actualizar el estado de la aplicación 
 para reflejar estos datos. 
 Declaración de una función asincrónica - Método `loadSensors*/
    async loadSensors(url) {
                     // Realiza una solicitud HTTP para obtener el archivo JSON con los datos de los sensores 
                     try{                                       // Declaración de una función asincrónica
                        const response = await fetch(url);          // Espera a que la promesa se resuelva
                        const sensorData = await response.json();   // Espera a que la respuesta se convierta en JSON
                        sensorData.forEach((sensorInfo)=>{          // Procesa cada sensor
                            const sensor = new Sensor(              // Añade el sensor creado al array de sensores
                                sensorInfo.id,
                                sensorInfo.name,
                                sensorInfo.type,
                                sensorInfo.value,
                                sensorInfo.unit,
                                sensorInfo.updated_at
                            );
                            this.addSensor(sensor);
                        });
                        this.render();                           // Llama a render para actualizar la vista
                    } catch (error) {
                        console.error("Error al cargar los sensores: ", error);
                    }
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}
// Creación y uso de una instancia de SensorManager
const monitor = new SensorManager();

monitor.loadSensors("sensors.json");