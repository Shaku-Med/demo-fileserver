
export const TokenKeys = [
    {
        name: `default`,
        keys: [`${process.env.Default_1}`, `${process.env.Default_2}`],
    },
    {
        name: `is_auth`,
        keys: [`${process.env.is_auth}`],
        expiresIn: '60d',
        algorithm: 'HS512'
    }
]

export const SetTokenKeys = [
    {
        name: `default`,
        keys: [`${process.env.Default_1}`, `${process.env.Default_2}`],
        expiresIn: '15s',
        algorithm: 'HS512'
    },
    {
        name: `login`,
        keys: [`${process.env.Login_1}`, `${process.env.Login_2}`],
        expiresIn: '10s',
        algorithm: 'HS512'
    },
    {
        name: `signup`,
        keys: [`${process.env.Signup_1}`, `${process.env.Signup_2}`],
        expiresIn: '10s',
        algorithm: 'HS512'
    },
    {
        name: `signup_csrf`,
        keys: [`${process.env.signup_csrf}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    },
    {
        name: `login_csrf`,
        keys: [`${process.env.login_csrf}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    },
    {
        name: `github_keys_csrf`,
        keys: [`${process.env.github_keys_csrf}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    },
    {
        name: `github_keys`,
        keys: [`${process.env.github_keys}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    },
    {
        name: `file_token`,
        keys: [`${process.env.file_token}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    },
    {
        name: `add_file`,
        keys: [`${process.env.add_file}`],
        expiresIn: '5s',
        algorithm: 'HS512'
    }
]