const jwt =require('jsonwebtoken');

const generarJWT=(uid)=>{
    return new Promise((resolve,reject)=>{
        const payload={ uid };

        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: '48h'
        }, (err,token)=>{
            if(err){
                console.log(err);
                reject(err)
            }else{
                resolve(token);
            }
        });
    })
}

module.exports={generarJWT};