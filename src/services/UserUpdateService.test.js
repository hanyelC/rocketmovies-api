const { hashSync, compareSync } = require("bcryptjs")
const { UserUpdateService } = require("./UserUpdateService")
const { UserRepositoryInMemory } = require("../repositories/UserRepositoryInMemory")

describe("UserUpdateService", () => {
  let userRepositoryInMemory
  let userUpdateService

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userUpdateService = new UserUpdateService(userRepositoryInMemory)
  })

  it("user should be updated with valid data", async () => {
    const user = {
      id: 17,
      name: "User From Test",
      email: "email@test.com",
      password: hashSync("secret", 8)
    }

    const newUserData = {
      id: 17,
      name: "New Name",
      email: "new@test.com",
      password: "secret",
      old_password: "secret"
    }

    userRepositoryInMemory = new UserRepositoryInMemory([user])
    userUpdateService = new UserUpdateService(userRepositoryInMemory)

    const userUpdated = await userUpdateService.execute(newUserData)

    const isUpdatedPasswordValid = compareSync(newUserData.password, userUpdated.password)

    expect(userUpdated.id).toEqual(newUserData.id)
    expect(userUpdated.name).toEqual(newUserData.name)
    expect(userUpdated.email).toEqual(newUserData.email)
    expect(isUpdatedPasswordValid).toBe(true)

  })
})