const formLogin = (req,res) => {
    res.render('auth/login',{
      
    })
}

const formSignin = (req,res) => {
    res.render('auth/signin',{
      
    })
}

export {
    formLogin,
    formSignin
}