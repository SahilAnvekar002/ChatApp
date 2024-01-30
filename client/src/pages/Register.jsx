import { useContext } from 'react'
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import {Link} from 'react-router-dom' 
import { AuthContext } from '../contexts/AuthContext'

const Register = () => {
  const authContext = useContext(AuthContext)
  const {registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading} = authContext

  return (
    <>
    
    <Form onSubmit={registerUser}>
      <Row style={{height: '100vh', justifyContent:'center', paddingTop:'8%'}}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Create an Account</h2>
            <Form.Control type='text' placeholder='Name' value={registerInfo.name} onChange={(e)=>updateRegisterInfo({
              ...registerInfo, name: e.target.value
            })}/>
            <Form.Control type='email' placeholder='Email' value={registerInfo.email} onChange={(e)=>updateRegisterInfo({
              ...registerInfo, email: e.target.value
            })}/>
            <Form.Control type='password' placeholder='Password' value={registerInfo.password} onChange={(e)=>updateRegisterInfo({
              ...registerInfo, password: e.target.value
            })}/>
            <span>Already have an account? <Link to='/login'>Click here</Link> to login</span>
            <Button style={{width:'30%'}} variant='primary' type='submit'>{isRegisterLoading ? "Creating user account": "Register"}</Button>
            {
            registerError?.error && 
            <Alert variant='danger'>
              <p>{registerError?.message}</p>
            </Alert>
            }
          </Stack>
        </Col>
      </Row>
    </Form>
    </>
  )
}

export default Register
