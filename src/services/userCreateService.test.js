const { UserCreateService } = require("./UserCreateService")
const { UserRepositoryInMemory } = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError")

describe("UserCreateService", () => {
  let userRepositoryInMemory
  let userCreateService

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it("user should be created with valid data", async () => {
    const user = {
      name: "User From Test",
      email: "email@test.com",
      password: "secret"
    }

    const userCreated = await userCreateService.execute(user)

    expect(userCreated).toHaveProperty("id")
  })

  it("user should not be created with invalid email", async () => {
    const user = {
      name: "User From Test",
      email: "lorem ipsum",
      password: "secret"
    }

    await expect(userCreateService.execute(user)).rejects.toEqual(new AppError("Formato de email inválido."))
  })

  it("user should not be created with an email already registered", async () => {
    const user1 = {
      name: "User From Test",
      email: "email@test.com",
      password: "secret"
    }

    const user2 = {
      name: "User From Test",
      email: "email@test.com",
      password: "secret"
    }

    await userCreateService.execute(user1)
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Email já cadastrado."))
  })

  it("user should not be created without name", async () => {
    const user = {
      email: "email@test.com",
      password: "secret"
    }

    await expect(userCreateService.execute(user)).rejects.toEqual(new AppError("Nome é obrigatório."))
  })

  it("user should not be created without email", async () => {
    const user = {
      name: "User From Test",
      password: "secret"
    }

    await expect(userCreateService.execute(user)).rejects.toEqual(new AppError("Email é obrigatório."))
  })

  it("user should not be created without password", async () => {
    const user = {
      name: "User From Test",
      email: "email@test.com"
    }

    await expect(userCreateService.execute(user)).rejects.toEqual(new AppError("Senha é obrigatória."))
  })
})