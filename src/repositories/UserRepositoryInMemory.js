class UserRepositoryInMemory {
  constructor(users = []) {
    this.users = users
  }

  async findByEmail(email) {
    const user = this.users.find(user => user.email === email)

    return user
  }

  async findById(id) {
    const user = this.users.find(user => user.id === id)

    return user
  }

  async create({ name, email, password }) {
    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      email,
      name,
      password
    }

    this.users.push(user)

    return user
  }

  async update({ id, name, email, password }) {
    this.users.map(user => {
      if (user.id === id) {
        return {
          id,
          name,
          email,
          password
        }
      }

    })

    return { id, name, email, password }
  }
}

module.exports = { UserRepositoryInMemory }
