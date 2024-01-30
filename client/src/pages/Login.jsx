import { useContext } from 'react'
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import {Link} from 'react-router-dom' 
import { AuthContext } from '../contexts/AuthContext'

const Login = () => {
  const {loginInfo, loginError, isLoginLoading, loginUser, updateLoginInfo} = useContext(AuthContext)

  return (
    <Form onSubmit={loginUser}>
      <Row style={{height: '100vh', justifyContent:'center', paddingTop:'10%'}}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Login to Account</h2>
            <Form.Control type='email' placeholder='Email' value={loginInfo.email} onChange={(e)=>updateLoginInfo({
              ...loginInfo, email: e.target.value
            })}/>
            <Form.Control type='password' placeholder='Password' value={loginInfo.password} onChange={(e)=>updateLoginInfo({
              ...loginInfo, password: e.target.value
            })}/>
            <span>Don't have an account? <Link to='/register'>Click here</Link> to register</span>
            <Button style={{width:'30%'}} variant='primary' type='submit'>{isLoginLoading ? "Logging into account": "Login"}</Button>
            {loginError?.error &&
              <Alert variant='danger'>
              <p>{loginError?.message}</p>
            </Alert>}
          </Stack>
        </Col>
      </Row>
    </Form>
  )
}

export default Login
