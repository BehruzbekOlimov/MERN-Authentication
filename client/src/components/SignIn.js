import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link as RouterLink} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as yup from "yup";
import {useFormik} from "formik";
import passwordValidator from "password-validator";
import axios from "axios";
import {useHistory} from 'react-router-dom'

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    errorMessage: {
        textAlign: 'inherit',
        backgroundColor: '#ffacac',
        width: '100%',
        color: '#474747',
        border: '1px solid #ff8888',
        borderRadius: '4px',
        marginTop: '24px',
        padding: '10px 28px',
    }
}));

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory()
    const [error, setError] = useState('')

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
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const config = {
                header: {
                    "Content-Type": "application/json",
                },
            }
            try {
                const {data,headers} = await axios.post('http://localhost:5000/api/users/auth', values, config)
                localStorage.setItem('token', headers['x-auth-token'])
                localStorage.setItem('user', JSON.stringify(data))
                history.push('/')
            } catch (err) {
                setError(err.response.data)
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Sign in
                </Typography>
                {error &&
                <Typography component="p" variant="body1" className={classes.errorMessage}>
                    {error}
                </Typography>}
                <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
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
                        autoFocus
                    />
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <RouterLink style={{textDecoration: 'none', color: '#3f51b5'}} to='/sign-up'
                                        variant="body2">
                                {"Don't have an account? Sign Up"}
                            </RouterLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
