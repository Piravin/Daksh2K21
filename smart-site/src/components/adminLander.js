import React, { Component} from 'react';
import {AuthContext} from '../public/authContext';
import {Hidden,Grid,Container,Card,CardContent,Typography,CardActions} from '@material-ui/core';
import {BaseURL} from '../public/baseURL';
import '../css/admin.css'
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {ProgressCircular} from './progress';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CreateWork from "./workForm";
import CreateDepartment from "./departmentForm";
import UserForm from "./userForm";
import PlanForm from "./planForm";

function AdminNav(props){
    return(
        <div className="admin-nav">
            <Link to="/"><div>Back to Home</div></Link>
            <Link to="/signout"><div className='signout'><div><AccountCircleIcon/></div><div>Signout</div></div></Link>
        </div>
    );
}

function ProjectCard(props){
    return(
        <Paper variant="outlined">
            <Link to={`/admin/project/${props.project._id}`}>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <ProgressCircular progress={props.project.progress}/>
                    </Grid>

                    <Grid item xs={8}>
                        <CardContent>
                            <Typography component="h6">
                                {props.project.projectid}
                            </Typography>
                            <Typography component="p">
                                Customer : {props.project.customer}
                            </Typography>                    
                        </CardContent>
                    </Grid>
                </Grid>
            </Link>
        </Paper>
    )
}

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects:[],
            departments:[],
            error:'',

            // Togglers
            plan : false,
            user : false,
            department : false,
            work : false
        }

        this.contentFetch = this.contentFetch.bind(this);
        this.togglePlan = this.togglePlan.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
        this.toggleDepartment = this.toggleDepartment.bind(this);
        this.toggleWork = this.toggleWork.bind(this);
    }
    contentFetch(){
        fetch(BaseURL + '/admin/projects',{method:'GET'})
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else throw new Error({message:response.json().error});
        })
        .then(projects => this.setState({projects:projects}))
        .catch(err=>this.setState({error:err}));
        fetch(BaseURL + '/admin/department',{method:'GET'})
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else throw new Error({message:response.json().error});
        })
        .then(departments => this.setState({departments:departments}))
        .catch(err=>this.setState({error:err}));
    }
    componentWillMount() {
        this.contentFetch();
    }

    togglePlan(){
        this.setState({ plan : ! this.state.plan });
    }
    toggleUser(){
        this.setState({ user : ! this.state.user });
    }
    toggleDepartment(){
        this.setState({ department : ! this.state.department });
    }
    toggleWork(){
        this.setState({ work : ! this.state.work });
    }

    render(){
        function progCalc(){
            try{
                let stats = this.projects.map(project => project.status);
                let total = stats.reduce((prev, curr) => prev + curr);
                return total / stats.length;
            }
            catch{
                console.log("Error");
            }
        }
        var progres = progCalc();
        return(
        <>
            <nav>
                <AdminNav/>             
            </nav>
            <main>
                <section className="header jumbotron ">
                    <Container>
                        <Grid container direction="row" justify="space-around" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={5}>
                                <ProgressCircular percent={40}/>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-evenly"}
                                    alignItems={"center"}
                                    minHeight={"40vh"}
                                    >
                                    <Box>
                                       <Button
                                           onClick={this.togglePlan}
                                           color={"primary"}
                                           variant={"contained"}
                                           m={3} p={2}>
                                           Create new Plan
                                       </Button>
                                    </Box>
                                    <Box>
                                        <Button
                                            onClick={this.toggleUser}
                                            color={"primary"}
                                            variant={"contained"}
                                            m={3} p={2}>
                                            Create new Staff or Customer
                                        </Button>
                                    </Box>
                                    <Box>
                                        <Button
                                            onClick={this.toggleDepartment}
                                            color={"primary"}
                                            variant={"contained"}
                                            m={3} p={2}>
                                            Create new Department
                                        </Button>
                                    </Box>
                                    <Box>
                                        <Button
                                            onClick={this.toggleWork}
                                            color={"primary"}
                                            variant={"contained"}
                                            m={3} p={2}>
                                            Create new Work
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </section>
                <section>
                    <Container p={4}>
                        {
                            this.state.projects.map(project=>(
                                <ProjectCard project={project}/>
                            ))
                        }
                    </Container>
                </section>
                <section className={"container"}>
                        <div className={"row"}>
                            <div className={"col-sm-6"}>

                            </div>
                            <div className={"col-sm-6"}>

                            </div>
                        </div>
                </section>
            </main>
            <CreateWork open={this.state.work} onCloseHandler={this.toggleWork}/>
            <CreateDepartment open={this.state.department} onCloseHandler={this.toggleDepartment}/>
            <UserForm open={this.state.user} onCloseHandler={this.toggleUser}/>
            <PlanForm open={this.state.plan} onCloseHandler={this.togglePlan}/>
        </>
        );
    }
}

export default AdminPage;
