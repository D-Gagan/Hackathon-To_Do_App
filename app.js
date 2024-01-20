// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
  });
  
  // Function to fetch tasks from the backend
  function fetchTasks() {
    fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(tasks => {
        displayTasks(tasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }
  
  // Function to display tasks on the webpage
  function displayTasks(tasks) {
    const taskListContainer = document.getElementById('taskList');
    taskListContainer.innerHTML = ''; // Clear existing content
  
    const ul = document.createElement('ul');
  
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.task;
      ul.appendChild(li);
    });
  
    taskListContainer.appendChild(ul);
  }
  
  // Function to create a new task
  function createTask() {
    const task = prompt('Enter the task:');
    if (task) {
      fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      })
        .then(() => fetchTasks())
        .catch(error => console.error('Error creating task:', error));
    }
  }
  
  // Function to edit an existing task
  // Function to edit an existing task
// Function to edit an existing task
function editTask() {
    const taskId = prompt('Enter the task ID to edit:');
    if (taskId && !isNaN(taskId)) { // Check if taskId is a valid number
      const task = prompt('Enter the updated task:');
      if (task) {
        fetch(`/tasks/${parseInt(taskId, 10)}`, { // Parse taskId to integer
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task }),
        })
          .then(() => fetchTasks())
          .catch(error => console.error('Error editing task:', error));
      }
    } else {
      alert('Invalid task ID. Please enter a valid number.');
    }
  }
  
  
  
  // Function to delete an existing task
  // Function to delete an existing task
// Function to delete an existing task
async function deleteTask() {
    const taskId = prompt('Enter the task ID to delete:');
    if (taskId && !isNaN(taskId)) { // Check if taskId is a valid number
      const confirmation = prompt('Enter "CONFIRM" to delete the task:');
      if (confirmation === 'CONFIRM') {
        try {
          const response = await fetch(`/tasks/${parseInt(taskId, 10)}`, { // Parse taskId to integer
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ confirmation }),
          });
  
          if (response.ok) {
            await fetchTasks(); // Update task list after successful deletion
          } else {
            const errorData = await response.json();
            console.error(`Error deleting task: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      } else {
        alert('Deletion canceled. Please provide the correct confirmation message.');
      }
    } else {
      alert('Invalid task ID. Please enter a valid number.');
    }
  }
  
  //Unable to fetch proper id for delete operation
  //Guess need to use AJAX for updating
