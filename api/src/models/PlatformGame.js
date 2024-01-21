const{DataTypes, Sequelize}=require('sequelize')

module.exports=(sequelize)=>{
    sequelize.define('PlatformGame',{
        released_at:{
            type:DataTypes.STRING 
        },
        requirements_en:{
            type:DataTypes.STRING
        },
        requirements_ru:{ 
            type:DataTypes.STRING
        },
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true
        }
    })
}