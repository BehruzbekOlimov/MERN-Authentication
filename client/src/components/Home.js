import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button, Container, Typography} from "@material-ui/core";

function Home() {
    const history = useHistory()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    return (
        <div>
            <Container style={{padding: '0', backgroundColor: 'white'}}>
                <Container style={{
                    backgroundColor: 'silver',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 36px'
                }}>
                    <Typography variant={'h6'} component={'h1'}>
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Button onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        setUser(null)
                        history.push('/sign-in')
                    }}
                            color={'secondary'}
                            variant="contained">
                        Log Out
                    </Button>
                </Container>
                <Container maxWidth={'lg'} style={
                    {
                        padding: '20px 10px'
                    }} fixed>
                    <p style={{margin: 0}}>
                        Hello Home Page!
                    </p>
                </Container>
            </Container>


        </div>
    );
}

export default Home;
