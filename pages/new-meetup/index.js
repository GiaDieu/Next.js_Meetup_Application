//our-domain.com/new-meetup
import { Fragment } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NewMeetupForm from '../../components/meetups/NewMeetupForm'

function newMeetupPage() {
  const router = useRouter()
  const addMeetupHandler = async (enteredMeetupData) => {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log(data)

    router.push('/')
  }

  return (
    <Fragment>
      <Head>
        <title>Add a New meetup</title>
        <meta
          name="description"
          content="Add your own meetups and create amazing networking opportunities"
        ></meta>
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  )
}

export default newMeetupPage
