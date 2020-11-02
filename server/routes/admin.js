const {Router} = require('express');
const Department = require('../models/department');
const {WorkTemplate, Plan} = require('../models/templates');
const User = require('../models/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const update = require('../aws');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const router = Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

const authChecker = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret_key',(err,decoded)=>{
            User.findOne({_id:decoded.data.id})
                .then(user=>{
                    if(user.group==='admin') {
                        res.locals.user_id = user._id;
                        next();
                    }
                    else
                        res.status(401).json({error:"unauthenticated"});
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500);
                });

        });
    }
    else{
        res.status(401);
        res.json({error:"unauthenticated"});
    }
}
// router.use(authChecker);

router.route(`/department`)
    .post((req, res) => {
            Department.findOne({ name: req.body.name }, (err, dept) => {
                if (dept) {
                    res.status(400).json({ error: "Department allready exists" }).end();
                }
            });
            Department.create({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name
            })
                .then(() => res.status(200).end())
                .catch(err => console.log(err));
        })

    .get((req,res)=>{
        Department.find( {} )
            .populate( `works managers` )
            .then( departments => res.status(200).json(departments) )
            .catch( err => res.status(500).json({error:err.message}) );
    })
    .put((req,res)=>{
        Department.update({_id:req.body._id},
            {$set:{
                name : req.body.name                
            }})
        .then(()=>res.status(200).end())
        .catch(err=>res.status(500).json({error:err.message}));
    })
    .delete((req,res)=>{
        Department.delete({_id:req.body._id})
        .then(()=>res.status(200).end())
        .catch(err=>res.status(500).json({error:err.message}));
    });

router.route(`/workTemplate`)
    .post((req,res) => {
        WorkTemplate.findOne( { name : req.body.name } )
            .then ( work => console.log(work) )
            .catch ( error => console.log(error));
        WorkTemplate.create({
            _id : mongoose.Types.ObjectId(),
            name : req.body.name,
            department : req.body.department,
            duration : Number(req.body.dump),
            cost : Number(req.body.cost)
        })
            .then ( work => {
                Department.update( { _id : req.body.department },
                    {
                        $push:{
                            works : work._id
                        }
                    })
                    .then( () => res.status(200).json( { message : `Added work ${work.name}` } ) )
                    .catch ( error => {
                        res.status(500).json({message: error.message});
                        console.log(error);
                    } );
            } )
            .catch ( error => res.status(500).json( { message : error.message } ) );
    })
    .get((req,res)=>{
        WorkTemplate.find({})
        .populate('department')
        .then(works=>res.status(200).json(works))
        .catch(err=>res.status(500).json({error:err.message}));
    })
    .delete((req,res)=>{
        WorkTemplate.delete({_id:req.body._id})
        .then(()=>{
            Department.update({},{$pull:{
                works : req.body.id
            }})
            .then(()=>res.status(200).json({message:"Successfully deleted work"}))
            .catch(err=>res.status(500).json(err));
        })
        .catch(err=>res.status(500).json(err));
    });

router.route('/staff')
    .get((req,res)=>{
        User.find({group:'staff'})
        .then(users=>res.status(200).json(users))
        .catch(err=>res.status(500).json(err));
    })
    .post((req,res)=>{
        User.find({staff_id:res.body.staff_id})
        .then(()=>res.status(400).json({error:"User allready exists"}))
        .catch(err=>console.log(err));
        User.create({
            staff_id: staff_id,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            group: 'staff'
        })
        .then(()=>res.status(200).json({message:`Successfully created staff ${req.body.name}`}))
        .catch(err=>res.status(500).json({error:err}));
    })
    .put((req,res)=>{
        User.findOne({_id : req.body._id})
        .then(user=>{
            User.update({_id:user._id},{$set:{
                name: req.body.name || user.name,
                email : req.body.email || user.email,
                staff_id : rereqs.body.staff_id || user.staff_id,
                department : req.body.department || user.department,
                mobile : req.body.mobile || user.mobile
            }})
            .then(()=>res.status(200).json({message:`Updated ${user.name} successfully`}))
            .catch(err=>res.status(500).json({error:err}));
        })
        .catch(err=>res.status(500).json({error:err}));
    })
    .delete((req,res)=>{
        User.delete({_id:req.body._id})
        .then(()=>res.status(200).json({message:`Deleted ${req.body.name}`}))
        .catch(err=>res.status(500).json({error:err}));
    });

router.route('/plan')
    .get((req,res)=>{
        Plan.findOne({_id:req.body._id})
        .then(plan=>{
            res.status(200).json(plan);
        })
        .catch(err=>res.status(500).json({error:err}));
    })
    .post(update.single('image'),(req,res)=>{
        Plan.update({_id:req.body._id},{$set:{
            name: req.body.name,
            image : req.file.location
        }})
        .then(()=>res.status(200).json({message:"Created plan"}))
        .catch(err=>res.status(500).json({error:err}));
    });

router.get('/getDepartmentBasic',(req,res)=>{
    Department.find({})
        .select("_id name")
        .then( departments => res.status(200).json(departments))
        .catch( error => res.status(500).json({ message : error }));
});

router.post('/createUser', async (req,res) => {
    User.findOne( { email : req.body.email } )
        .then ( user => {
            // res.status(400).json( { message : "A user with this email allready exists "})
            console.log(user);
        })
        .catch ( error => console.log(error.message));

    if ( req.body.group === "staff" ) {
        User.findOne( { staff_id : req.body.staff_id } )
            .then ( user => res.status(400).json( { message : `${user.name} is allready assigned with this staff id`}))
            .catch ( error => console.log(error.message));
    }

    let pass = await bcrypt.hash(req.body.password,'$2b$10$SN5MRK.PivkVFa2Yi7gYIu');
    User.create( {
        _id : mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : pass,
        group : req.body.group,
        mobile : req.body.mobile || 0
    } )
        .then ( user => {
            if ( req.body.group === "staff" ) {
                Department.update( { _id : req.body.department } , {
                    $push : { managers : user._id }
                })
            }
            res.status(200).json({message: `Addeded ${user.name}`});
        } )
        .catch ( error => res.status(500).json({message : error.message}));
});

router.get('/workBasic',(req,res)=>{
    WorkTemplate.find({})
        .select("name")
        .then( works => res.status(200).json(works))
        .catch( error => res.status(500).json({message:error.message}));
});


module.exports = router;