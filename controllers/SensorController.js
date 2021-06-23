const fns           = require('date-fns')
const sensorJson    = require('../assets/sensor_data.json')

const calculateData = (record) => {
    const sum   = record.reduce((a, b) => a+b, 0)

    return {
        max : Math.max(...record),
        min : Math.min(...record),
        avg : sum/(record.length),
        median  : record.length%2 === 0 ? ((record[(record.length/2)-1]+record[((record.length/2)+1)-1])/2) : record[((record.length + 1)/2)-1]
    }
}

exports.index = async (req, res) => {
    const data  = sensorJson.array.map(item => {
        const date   = new Date(item.timestamp)

        return {
            ...item,
            day : fns.format(date, 'dd-MM-yyyy')
        }
    })

    const groupedByDay  = data.reduce((acc, item) => {
        
        if(!acc[item.day]){
            acc[item.day]   = {
                [item.roomArea] : {
                    record_temperature  : [item.temperature],
                    record_humidity     : [item.humidity],
                    temperature : {
                        max     : item.temperature,
                        min     : item.temperature,
                        median  : item.temperature,
                        avg     : item.temperature
                    },
                    humidity    : {
                        max     : item.humidity,
                        min     : item.humidity,
                        median  : item.humidity,
                        avg     : item.humidity
                    }
                    
                }
            }
        }
        else{
            if(!acc[item.day][item.roomArea]){
                acc[item.day][item.roomArea]    = {
                    record_temperature  : [item.temperature],
                    record_humidity     : [item.humidity],
                    temperature : {
                        max     : item.temperature,
                        min     : item.temperature,
                        median  : item.temperature,
                        avg     : item.temperature
                    },
                    humidity    : {
                        max     : item.humidity,
                        min     : item.humidity,
                        median  : item.humidity,
                        avg     : item.humidity
                    }
                }
            }
            else{
                acc[item.day][item.roomArea].record_temperature     = [...acc[item.day][item.roomArea].record_temperature, item.temperature].sort((a, b) => a - b);
                acc[item.day][item.roomArea].record_humidity        = [...acc[item.day][item.roomArea].record_humidity, item.humidity].sort((a, b) => a - b);
                
                const recordTemperature = acc[item.day][item.roomArea].record_temperature                
                const recordHumidity    = acc[item.day][item.roomArea].record_humidity

                acc[item.day][item.roomArea].humidity       = calculateData(recordHumidity)
                acc[item.day][item.roomArea].temperature    = calculateData(recordTemperature)
            }
        }

        return acc;

    }, {})

    res.json(groupedByDay)
}