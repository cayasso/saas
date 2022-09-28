const Index = ({ project }) => {
  return <h1>{project.data}</h1>
}

export const getStaticPaths = async () => {
  const paths = [
    { params: { domain: 'test' } },
    { params: { domain: 'test2' } }
  ]

  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async context => {
  const data = [
    { domain: 'test', data: 'My first test project' },
    { domain: 'test2', data: 'My second test project' }
  ]

  const project = data.find(p => p.domain === context.params.domain)

  if (!project) {
    return {
      notFound: true
    }
  }

  return {
    props: { project }
  }
}

export default Index
