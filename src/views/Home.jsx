import React, {useState} from 'react'
import HomeHead from '../components/HomeHead'
import _ from '../assets/utils'

export default function Home() {
  const [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"));

  return (
    <div className='home-box'>
      <HomeHead today={today}></HomeHead>
    </div>
  )
}
