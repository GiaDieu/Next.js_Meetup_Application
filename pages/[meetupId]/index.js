import { Fragment } from 'react'
import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import MeetupDetail from '../../components/meetups/MeetupDetail'

function MeetupDetails(props) {
  const { meetupData } = props
  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </Fragment>
  )
}

export default MeetupDetails

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzoke.mongodb.net/meetups?retryWrites=true&w=majority`,
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()
  return {
    fallback: false,
    // generate all paths (meetupId) dynamically.
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  }
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzoke.mongodb.net/meetups?retryWrites=true&w=majority`,
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  }
}
