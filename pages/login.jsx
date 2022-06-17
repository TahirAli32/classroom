import React, { useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Login.module.scss'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaLock } from 'react-icons/fa'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { MdError } from 'react-icons/md'
import { useRouter } from 'next/router'
import axios from 'axios'

const Login = () => {

  const router = useRouter()

  const [viewPassword, setViewPassword] = useState(false)
  const [inputError, setInputError] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const successLogin = () => {
    setSubmitError(false)
    setInputError(false)
    router.push('/')
  }

  const handleSubmit = async () => {
    if(emailRef.current.value === "" || passwordRef.current.value === ""){
      setInputError(true)
      setSubmitError(false)
      return
    }
    setInputError(false)

    const credentials = {email: emailRef.current.value, password: passwordRef.current.value}
    const user = await axios.post('/api/loginuser', credentials)

    user.data.success ? successLogin() : setSubmitError(user.data.error); setInputError(false)

    // console.log(user.data)
  }

  return (
    <main className={styles.main}>
      <Head>
        <title>Login - Classroom</title>
        <meta name="description" content="Classroom built by Muhammad Tahir Ali" />
      </Head>
      <div className={styles.login}>
        <h6>Log in you Account</h6>
        {inputError && <div className={styles.error}><span><MdError /></span>All fields are required</div>}
        {submitError && <div className={styles.error}><span><MdError /></span>{submitError}</div>}
        <div className={styles.inputField}>
          <span className={styles.icon}><BsFillPersonFill /></span>
          <input ref={emailRef} id='email' className={styles.inputBox} placeholder='Enter your Email' type="text" />
        </div>
        <div className={styles.inputField}>
          <span className={styles.icon}><FaLock /></span>
          <input ref={passwordRef} id='password' className={styles.inputBox} placeholder='Enter your Password' type={!viewPassword ? 'password' : 'text'} />
          <span className={`${styles.icon} ${styles.viewPw}`} onClick={() => setViewPassword(!viewPassword)}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
        </div>
        <div className={styles.otherChecks} style={{ marginTop: '5px' }}>
          <div>
            <input style={{ cursor: 'pointer' }} type='checkbox' id='rememberMe' />
            <label htmlFor='rememberMe' style={{ marginLeft: '5px', cursor: 'pointer' }}>Keep me logged in</label>
          </div>
          <p className={styles.forgotPw}>Forgot Password?</p>
        </div>
        <button className={styles.btn} style={{ marginTop: '1.5rem' }} onClick={handleSubmit}>Login</button>
        <div className={styles.signUp}>
          <p>Don&apos;t have an Account ?</p>
          <Link href='/signup'><button className={`${styles.btn} ${styles.btnSignUp}`}>Sign Up</button></Link>
        </div>
      </div>
    </main>
  )
}

export default Login