import React, { useEffect, useContext, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { BsFillExclamationTriangleFill, BsThreeDotsVertical } from 'react-icons/bs'
import styles from '../../../styles/Slug.module.scss'
import AuthContext from '../../../stores/authContext'
import axios from 'axios'
import { DotsLoader } from '../../../components/Loader'

const Slug = () => {

  const router = useRouter()
  const { slug } = router.query

  const authContext = useContext(AuthContext)

  const [classInfo, setClassInfo] = useState([])
  const [renderKey, setRenderKey] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [dropdownManageClass, setDropdownManageClass] = useState(false)

  const activityRef = useRef()
  
  let UserID = authContext.userID

  useEffect(() => {
    const classCredentials = {
      classroomSlug: slug,
      userID: UserID
    }
    const fetchClassData = async () => {
      setLoading(true)
      if(UserID){
        const classData = await axios.post('/api/class/getclass', classCredentials)
        setClassInfo(classData.data)
        setLoading(false)
        return
      }
    }
    fetchClassData()
  }, [UserID, slug, renderKey])

  async function postActivity() {
    if(!activityRef.current.value.match(/([^\s])/)){
      return
    }
    const activityCredentials = {
      classroomCode: classInfo.classInfo.classroomCode,
      byUser: classInfo.userInfo.name,
      postMsg: activityRef.current.value
    }
    await axios.post('/api/class/postactivity', activityCredentials)
    activityRef.current.value = ""
    setRenderKey(Math.random)
  }
  
  async function handleDelete(isTeacher){
    const reqData = {
      userID: UserID,
      classID: classInfo.classInfo.classroomID,
      isTeacher: isTeacher
    }
    let res = await axios.post('/api/class/deleteclass', reqData)
    res.data.success ? router.push('/') : console.log(res.data)
  }

  return (
    <div>
      <Head>
        <title>{classInfo.success ? classInfo.classInfo.classroomName : 'Classroom'}</title>
        <meta name="description" content="Classroom built by Muhammad Tahir Ali" />
      </Head>
      {isLoading ? <DotsLoader loadingText="Loading Class Data" /> : <>
        <main className={styles.main}>
          {classInfo.success ?
            <>
              <div className={styles.top}>
                <div className={styles.classInfo}>
                  <h1>{classInfo.classInfo.classroomName}</h1>
                  <h3>{classInfo.classInfo.classroomDesc}</h3>
                  <h3>Class Code: {classInfo.classInfo.classroomCode}</h3>
                  <h2>Total Student(s): {classInfo.classInfo.classroomMembers.length}</h2>
                  <div onClick={()=> setDropdownManageClass(!dropdownManageClass)} className={styles.settingIcon}><BsThreeDotsVertical /></div>
                  {dropdownManageClass &&
                    <ul onMouseEnter={() => setDropdownManageClass(true)} onMouseLeave={() => setDropdownManageClass(false)} className={styles.dropDown}>
                      {classInfo.classInfo.classroomTeacherID === UserID ?
                        <>
                          <li>Class Settings</li>
                          <li onClick={()=> handleDelete(true)}>Delete Class</li>
                        </>
                        :
                        <>
                          <li onClick={()=> handleDelete(false)}>Leave Class</li>
                        </>
                      }
                    </ul>
                  }
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.left}>
                  {classInfo.classInfo.classroomTeacherID === UserID ?
                    <>
                      <h4 style={{ paddingBottom: '0' }}>Create Assignment</h4>
                      <Link href={`${slug}/assignments/create`}><button className={styles.btn}>Create Now</button></Link>
                      <h4 style={{ paddingBottom: '0', marginTop: '25px' }}>View All Assignments</h4>
                      <Link href={`${slug}/assignments`}><button className={styles.btn}>View All</button></Link>
                    </>
                    :
                    <>
                      <h4>Upcoming Submissions</h4>
                      <p>Wohoo! Nothing to do right now.</p>
                      <Link href={`${slug}/assignments`}><button className={styles.btn}>View All</button></Link>
                    </>
                  }
                </div>
                <div className={styles.right}>
                  <div className={styles.postInput}>
                    <input ref={activityRef} type="text" placeholder='Post Activity...'/>
                    <button className={styles.btn} onClick={()=>postActivity()}>Post Activity</button>
                  </div>
                  <div className={styles.activityTimeline}>
                    {classInfo.classInfo.classroomActivity.length ?
                      <>{
                        classInfo.classInfo.classroomActivity.map((eachActivity, index) => (
                          <p key={index}>{eachActivity.postMsg} by <span style={{fontWeight: '600', opacity: '0.6', color: 'blue'}}>{eachActivity.byUser}</span></p>
                        ))
                      }</>
                      :
                      <span style={{borderRadius: '4px', border: '0.1rem solid #d6d4d4', minHeight: '25vh', paddingTop: '10vh', paddingLeft: '20%', width: '100%', fontSize: '19px'}}>Class Activity will show up here</span>
                    }
                  </div>
                </div>
              </div>
            </>
            : 
            <div className={styles.noClass}>
              <span><BsFillExclamationTriangleFill /></span>
              <h2>{classInfo.error}</h2>
              <Link href='/'><p>Return to Home</p></Link>
            </div>
          }
        </main>
        </>}
    </div>
  )
}

export default Slug