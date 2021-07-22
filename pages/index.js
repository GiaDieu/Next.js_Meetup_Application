import { Fragment } from 'react'
import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}

/* ----------------------------- getServerSideProps -------------------------- */

/*
 - You cannot use getStaticPaths with getServerSideProps.
 - This function will not run during the build process, but instead always
  on the server after deployment.
 - should only use if we need access to that concrete request object.
 - if data changes multiple times every second
*/

// export async function getServerSideProps(context) {
//   const req = context.req
//   const res = context.res

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

/* ----------------------------- getStaticProps -------------------------- */

/*
  This function gets called at build time on server-side.
  It may be called again, on a serverless function, if
  revalidation is enabled and a new request comes in
*/

/*  Validation:
    - Next.js will attempt to re-generate the page:
    - When a request comes in
    - At most once every 10 seconds
    revalidate: 10, // In seconds
    - if data changes multiple times every second, validate won't help us much.
*/

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzoke.mongodb.net/meetups?retryWrites=true&w=majority`,
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  }
}

export default HomePage
