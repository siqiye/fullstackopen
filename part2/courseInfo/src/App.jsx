const Part = ({name, exercises}) => {
  return (
    <div>
      {name} {exercises}
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};


const Header = ({name}) => {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}

const Statistics = ({parts}) =>{
  const all = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      <h4>total of {all} exercises</h4>
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Statistics parts={course.parts} />
    </div>
  )
}

const Courses = ({courses}) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
    <div>
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </div>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Courses courses={courses} />
}

export default App