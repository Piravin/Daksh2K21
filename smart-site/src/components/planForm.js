import React, {Component} from "react";
import {BaseURL} from "../public/baseURL";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import {Button, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {CheckBox} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import Container from "@material-ui/core/Container";

const styles =  () => ({
    appBar : {
        position : 'relative'
    },
    title : {
        flex : 1
    },
    paper : {
        width : "100%",
        height : "50vh",
        overflow : "auto"
    },
    white : {
        color : '#ffffff'
    }
});

class PlanForm extends Component {
    constructor(props) {
        super(props);

        this.state = {

            // Fetched data
            availableWorks : [],

            // Data to post
            selectedWorks : new Set(),
            images : [],
            name : '',

            // Form control
            checkedLeft : [],
            checkedRight : [],

            // Connection control
            error : false,
            success : false,
            toastMessage : null

        }

        this.dataFetcher = this.dataFetcher.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }

    dataFetcher() {
        fetch(BaseURL + '/admin/workBasic')
            .then ( response => {
                if ( response.ok )
                    return response.json();
                else throw new Error( { message : response.json().message } )
            })
            .then ( data => this.setState( { availableWorks : data } ))
            .catch ( error => {
                this.setState( { error : true, toastMessage : error.message } )
            })
    }

    handleSelect ( id ) {
        let newList = this.state.selectedWorks;
        if ( this.state.selectedWorks.has( id ) )
            newList.delete( id );
        else
            newList.add( id );
        this.setState({ selectedWorks: newList});
    }

    handleSubmit () {
        let formData = new FormData();
        formData.append( "name" , this.state.name );
        formData.append( "works" , [...this.state.selectedWorks] );
        formData.append( "imgNo" , this.state.images.length );
        formData.append( "images" , this.state.images );

        fetch( BaseURL + '/admin/plan' , {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : formData
        })
            .then( response => {
                if(response.ok)
                    response.json();
                else
                    throw new Error({message: response.json().message});
            })
            .then( response => this.setState( { success : true, toastMessage : response.message }))
            .catch( error => this.setState( { error : true, toastMessage : error.message } ) )
    }

    render() {

        const { classes } = this.props;

        return(
            <>
               <Dialog fullScreen open={ this.props.open } onClose={ this.props.onCloseHandler }>
                   <AppBar className={ classes.appBar }>
                        <Box display={"flex"}
                             justifyContent={"space-between"}
                             flexDirection={"row"}
                             alignItems={"center"}
                             pl={4} pr={4}
                             >
                           <Typography component={"h6"} classNames={ classes.title }>Create a new plan</Typography>
                           <IconButton className={classes.white} edge={"start"} onClick={ this.props.onCloseHandler }>
                               <CloseIcon />
                           </IconButton>
                        </Box>
                   </AppBar>
                   <Box width={"100%"} height={100}></Box>
                   <Container>
                       <Grid container m={3} justify={"flex-start"} alignItems={"center"} direction={"row"} spacing={4}>
                           <Grid item xs={12} md={6}>
                               <TextField variant={"outlined"} label = "Name" value={ this.state.name } onChange={ e => this.setState( { name : e.target.value } ) } fullWidth={true}/>
                           </Grid>
                           <Grid item xs={12} md={6}>
                               <Input variant={"outlined"} label={"Images"} value={ this.state.images } type = "file" onChange={ e => this.setState( {images : e.target.file } ) }/>
                           </Grid>
                           <Grid item container spacing={4} xs={12}>
                                <Grid item xs={4}>
                                    <Container>
                                        <List component={"div"} role={"list"}>
                                            { this.state.availableWorks.map ( work => (
                                                <ListItem key={work._id} button onClick={ this.handleSelect(work._id) }>
                                                    <ListItemIcon>
                                                        <CheckBox
                                                            checked={ this.state.selectedWorks.has( work._id ) }
                                                            tabIndex={-1}
                                                            />
                                                    </ListItemIcon>
                                                    <ListItemText primary={ work.name }/>
                                                </ListItem>
                                            ))}
                                       </List>
                                    </Container>
                               </Grid>
                           </Grid>
                           <Divider/>
                           <Grid item >
                               <Button variant={"contained"} onClick={ this.handleSubmit } color={"primary"}>
                                   Submit
                               </Button>
                           </Grid>
                       </Grid>
                   </Container>
               </Dialog>
            </>
        )
    }
}

export default withStyles(styles)(PlanForm);