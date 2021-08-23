const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'mysecretkey',
        ACCESS:'6120e49517876d67804b8976',
        DATABASE: 'mongodb://localhost:27017/Users' //'mongodb://localhost:27017/Dashboard'
        //DATABASE1: 'mongodb://localhost:27017/Dashboards'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}