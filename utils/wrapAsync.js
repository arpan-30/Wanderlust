// function wrapAsync(fn){
//     return function(req,res,next){
//         // fun(req,res,next).catch((err)=>next(err))
//         fn(req,res,next).catch(next);
//     }
// }


module.exports=(fn)=>{
    return (req,res,next)=>{
        // fun(req,res,next).catch((err)=>next(err))
        fn(req,res,next).catch(next);
    }
}