import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import styles from '@style/Home.module.css'

import { useLoginContext } from '@context'
import { ROUTES } from '@util'
import { Header, Teammates } from '@component'
import { useAxios } from '@hook'

const Home: React.FC = () => {
  const { me, isLoggedIn } = useLoginContext()
  const router = useRouter()
  const { api } = useAxios()
  const [teammates, setTeammates] = useState<any>({})

  const fetchTeammates = async () => {
    try {
      const response = (await api.teams.getTeammates()) as any
      setTeammates(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchTeammates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    if (!isLoggedIn) router.replace(ROUTES.Login)
  }, [isLoggedIn, router])

  return (
    <>
      <Header title="메인" />
      <div className={styles.container}>
        <Teammates teammates={teammates} />
      </div>
    </>
  )
}

export default Home
