import { useEffect, useState } from 'react';
import personServices from './services/persons'
import './index.css'

// 过滤组件
const Filter = ({filter, handleFilterChange}) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

// 新增联系人表单组件
const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
)

// 展示联系人列表组件，同时每个联系人后都有删除按钮
const Persons = ({personsToShow, deletePerson}) => (
  <div>
    {personsToShow.map((person) => (
      <div>
      <p key={person.id}>
        {person.name} {person.number}
      </p>
      <button onClick={() => deletePerson(person.id)}>delete</button>
      </div>
    ))}
  </div>
);

// 用于显示错误提示的组件
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

// 用于显示成功提示的组件（绿色样式）
const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <div className="success">
      {message}
    </div>
  );
};

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}






const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null);

  // 获取初始联系人数据
  useEffect(() => {
    personServices
      .getAll()
      .then(initialResult => {
        setPersons(initialResult)
      })
  }, [])

  // 添加新联系人或更新已存在联系人的号码
  const addPerson = (event) => {
    event.preventDefault();

    const newPerson = { name: newName, number: newNumber};
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());

    if(existingPerson) {
      if(existingPerson.number === newNumber) {
        setErrorMessage(`${newName} is already added to phonebook`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return;
      }else {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const updatedPerson = {...existingPerson, number: newNumber};
          personServices
            .update(existingPerson.id, updatedPerson)
            .then(returnedData => {
              setPersons(persons.map(p => p.id != existingPerson.id? p: returnedData));
              setNewName('');
              setNewNumber('');
              setSuccessMessage(`Updated ${newName}'s number`);
              setTimeout(() => {
                setSuccessMessage(null);
              }, 5000);
            })
            .catch(error => {
              setErrorMessage(
                `the person '${newName}' was already deleted from server`
              );
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            })
        }
        return;
      }
    }

    personServices
      .create(newPerson)
      .then(returnedData => {
        setPersons(persons.concat(returnedData));
        setNewName('');
        setNewNumber('');
        setSuccessMessage(`Added ${newName}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
  };

  // 删除联系人
  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if(person && confirm(`Delete ${person.name} ?`)) {
      personServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setErrorMessage("Failed to delete the person from the server.");
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
    }
  }

  // 根据 filter 筛选联系人（大小写不敏感）
  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <SuccessNotification message={successMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
      <Footer />
    </div>
  );
};

export default App;
