const { hashSync, compareSync } = require("bcryptjs")
const { UserUpdateService } = require("./UserUpdateService")
const { UserRepositoryInMemory } = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError")

describe("UserUpdateService", () => {
  let userRepositoryInMemory
  let userUpdateService

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory(
      [
        { id: 1, name: "User From Test", email: "email@test.com", password: hashSync("secret", 8) },
        { id: 2, name: "One more Users", email: "test@email.com", password: hashSync("s3cr3t", 8) }
      ]
    )
    userUpdateService = new UserUpdateService(userRepositoryInMemory)
  })

  it("user should be updated with valid data", async () => {

    const newUserData = {
      id: 1,
      name: "New Name",
      email: "new@test.com",
      password: "secret",
      old_password: "secret"
    }

    const userUpdated = await userUpdateService.execute(newUserData)

    const isUpdatedPasswordValid = compareSync(newUserData.password, userUpdated.password)

    expect(userUpdated.id).toEqual(newUserData.id)
    expect(userUpdated.name).toEqual(newUserData.name)
    expect(userUpdated.email).toEqual(newUserData.email)
    expect(isUpdatedPasswordValid).toBe(true)

  })

  it("user should not be updated without id", async () => {
    const newUserData = {
      name: "New Name",
      email: "new@test.com",
      password: "secret",
      old_password: "secret"
    }

    await expect(userUpdateService.execute(newUserData)).rejects.toEqual(new AppError("Usuário não encontrado"))

  })

  it("user email should not be updated to an email already in use", async () => {
    const newUserData = {
      id: 2,
      email: "email@test.com"
    }

    await expect(userUpdateService.execute(newUserData)).rejects.toEqual(new AppError("Email já está em uso"))

  })

  it("user that not exists should not be updated", async () => {
    const newUserData = {
      id: 50,
      email: "foo@baz.com"
    }

    await expect(userUpdateService.execute(newUserData)).rejects.toEqual(new AppError("Usuário não encontrado"))
  })

  it("user password should not be updated without give old password", async () => {
    const newUserData = {
      id: 1,
      password: "secret"
    }

    await expect(userUpdateService.execute(newUserData)).rejects.toEqual(new AppError("Você precisa informar a senha antiga para alterar a sua senha"))
  })

  it("user password should not be updated when wrong old password is given", async () => {
    const newUserData = {
      id: 1,
      password: "secret",
      old_password: "wrong password"
    }

    await expect(userUpdateService.execute(newUserData)).rejects.toEqual(new AppError("A senha antiga não confere"))
  })

})