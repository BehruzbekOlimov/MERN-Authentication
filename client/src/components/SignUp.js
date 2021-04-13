import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import passwordValidator from "password-validator";
import * as yup from "yup";
import {useFormik} from "formik";
import {Link as RouterLink} from "react-router-dom";
import axios from "axios";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();

    const history=useHistory()

    const passwordSchema = new passwordValidator()
    passwordSchema
        .is().min(8)
        .is().max(128)
        .has().uppercase(2)
        .has().symbols()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
    const validationSchema = yup.object({
        firstName: yup
            .string('Enter your name first name')
            .min(2, 'First name should be of minimum 2 characters length')
            .max(40, 'First name should be of maximum 40 characters length')
            .required('First name is required'),
        lastName: yup
            .string('Enter your name last name')
            .min(2, 'Last name should be of minimum 2 characters length')
            .max(40, 'Last name should be of maximum 40 characters length')
            .required('Last name is required'),
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .max(128, 'Password should be of maximum 128 characters length')
            .required('Password is required')
            .test(
                'password',
                'password must be contains minimum two uppercase, one lowercase, one symbol and two digits!',
                (value) => {
                    return passwordSchema.validate(value)
                }
            )
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            axios.post('http://localhost:5000/api/users', values)
                .then(r => {
                    localStorage.setItem('token', r.headers['x-auth-token'])
                    localStorage.setItem('user', JSON.stringify(r.data))
                    history.push('/')
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
    });


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <RouterLink style={{textDecoration: 'none',color: '#3f51b5'}} to='/sign-in' variant="body2">
                                Already have an account? Sign in
                            </RouterLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
