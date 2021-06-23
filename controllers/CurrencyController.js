const axios         = require('axios')
const salaryJson    = require('../assets/salary_data.json')

exports.index = async (req, res) => {
    try{
        const {data: conversion}    = await axios.get(`https://free.currconv.com/api/v7/convert?q=IDR_USD,USD_IDR&compact=ultra&apiKey=${process.env.CURRENCY_CONVERTER_API_KEY}`)
        const {data: users}         = await axios.get('http://jsonplaceholder.typicode.com/users')

        const data  = users.map((item) => {
            const salary    = salaryJson.array.find(s => s.id === item.id)

            delete item.website;
            delete item.company;

            const salaryInUSD   = salary.salaryInIDR * conversion.IDR_USD;

            return {
                ...item, 
                ...salary,
                salaryInUSD
            }
        })

        res.json(data)
    }
    catch(err){
        res.json({
            status  : 'error',
            message : err.message
        })
    }
    
}