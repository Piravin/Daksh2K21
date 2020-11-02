const {Router} = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Work = require('../models/work');
const Project = require('../models/project');
const Message = require('../models/message');
const PlanTemplate = require('../models/templates');
const WorkTemplate = require('../models/templates');
const router = Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(cookieParser());


router.get('/unauth',(req,res)=>{
    Project.findOne({_id:req.params.projectid})
                .populate(['customer',{path:'works',populate:[{path:'user'},{path:'updates'},{path:'work',populate:{path:'department'}}]}])
                .then(project=>{
                    if(user._id===project.user._id){
                        res.status(200).json(project);
                    }
                    else
                    res.status(401).json({error:"unauthenticated"});
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500);
                });
})

router.get('/works/:projectid',(req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret_key',(err,decoded)=>{
            User.findOne({ _id : decoded.data.id })
            .then(user => {
                Project.findOne({ _id : req.params.projectid })
                .populate(['customer',{path:'works',populate:[{path:'user'},{path:'updates'},{path:'work',populate:{path:'department'}}]}])
                .then(project=>{
                    if(user._id===project.user._id){
                        res.status(200).json(project);
                    }
                    else
                    res.status(401).json({error:"unauthenticated"});
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500);
                }); 
                
            })
            .catch(err=>{
                console.log(err);
                res.status(500);
            });
            
        }); }
});

router.get('/message',(req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret_key',(err,decoded)=>{
            User.findOne({_id:decoded.data.id})
                .then(user=>{
                    let data = {};
                    Message.find({ to : { $in : user.projects } })
                        .then( messages => {
                            data.messages = messages;
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500);
                        });
                    data.projects = user.projects;
                    res.status(200).send(data);
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500);
                });

        }); }
});

router.get('/createProject',(req,res)=>{
    let customer = '5f9ec71e47451b317cd62f9d';

})

module.exports = router;


