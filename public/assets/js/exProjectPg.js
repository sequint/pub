// Function to delete the project.
document.addEventListener('click', event => {

  if (event.target.classList.contains('deleteProject')) {

    let id = JSON.parse(localStorage.getItem('myProject'))

    axios.delete(`/api/projects/${id}`)
      .then(() => {
        window.location.href = './myProjects.html'
      })
      .catch(err => console.log(err))
  }

})

// Create an array to hold the tasks entered.
let tasks = []

// Create a function to post the tasks into the array to tasks table with the project id attached.
const addTasks = projectId => {

  // Iterate through tasks list and post each task to the tasks model with current project id.
  tasks.forEach(task => {
    axios.post('/api/tasks', {
      taskDescription: task,
      isComplete: false,
      projectId: projectId
    })
  })

}

// Handle create project click.
document.getElementById('saveChanges').addEventListener('click', event => {
  event.preventDefault()

  let projectId = JSON.parse(localStorage.getItem('myProject'))

  // Create data variable using values from form inputs.
  let categoryName = event.target.parentNode.parentNode.children[1].children[0].children[2].children[1].value

  // Create a post axios request to send new project information to the database.
  axios.put(`/api/projects/${projectId}`, {
    projectName: event.target.parentNode.parentNode.children[1].children[0].children[0].children[1].value,
    description: event.target.parentNode.parentNode.children[1].children[0].children[1].children[1].value,
    startDate: event.target.parentNode.parentNode.children[1].children[0].children[5].children[0].value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(({ data: payload }) => {
      addTasks(projectId)
      addCategoryId(categoryName, payload.project)
      renderProjects(payload.project)
    })
    .catch(err => console.log(err))

})

document.getElementById('addTask').addEventListener('click', event => {
  event.preventDefault()

  console.log('in click')
  // Element to hold the task value entered.
  let task = event.target.parentNode.children[1].value
  console.log(task)

  // Push new task value into the tasks array.
  tasks.push(task)

  // Create element to hold task html and append to the task list.
  let nextTask = document.createElement('li')
  nextTask.innerHTML = `
  <p>${task}<button type="button" class="btn btn-danger btn-sm">X</button></p>
  `
  document.getElementById('task-list').append(nextTask)
  document.getElementById('projectTasks').value = ''

})

// Load all project content to the page
const loadProjectContent = _ => {
  // Grab project id clicked on from local storage and store into a variable.
  let projectId = JSON.parse(localStorage.getItem('myProject'))

  // Get project with the id.
  axios.get(`/api/projects/${projectId}`)
    .then(({ data: payload }) => {
      // Set project variable.
      let project = payload.project[0]

      document.getElementById('myIndProjTitle').textContent = project.projectName
      document.getElementById('description').textContent = project.description
      document.getElementById('startDate').textContent = `Start Date: ${project.startDate}`

      let progressBar = document.createElement('div')
      progressBar.className = 'col'
      progressBar.innerHTML = `
      <p class="card-text mb-0" >Progress:</p>
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${project.percentComplete}%" aria-valuenow="${project.percentComplete}" aria-valuemin="0" aria-valuemax="100">${project.percentComplete}%</div>
      </div>
      `
      document.getElementById('progressArea').append(progressBar)

      axios.get(`/api/tasks/${project.id}`)
        .then(({ data: payload }) => {
          // Set array variable for tasks returned.
          let tasks = payload.task
          // Loop through tasks array and append each task to the page.
          tasks.forEach(task => {

            let taskItem = document.createElement('li')
            taskItem.className = 'm-1'
            taskItem.textContent = task.taskDescription

            // Append new task to the task list.
            document.getElementById('tasksLi').append(taskItem)

          })
        })
        .catch(err => console.log(err))

      axios.get(`/api/comments/${projectId}`)
        .then(({ data: payload }) => {
          // Set returned array to a comments variable.
          let comments = payload.comment

          // Append comments to the page.
          comments.forEach(comment => {

            axios.get(`/api/users/${comment.commentorId}`)
              .then(({ data: payload }) => {
                // Assign user data a variable.
                let user = payload.user[0]

                // Append comment to the page.
                let commentCard = document.createElement('div')
                commentCard.className = 'card'
                commentCard.innerHTML = `
                <div class="card-body">
                  <h6 class="card-title">${user.username}</h6>
                  <p class="card-text">${comment.content}</p>
                </div>
                `
                document.getElementById('comments').append(commentCard)
              })

          })

        })
        .catch(err => console.log(err))

    })

}

loadProjectContent()
