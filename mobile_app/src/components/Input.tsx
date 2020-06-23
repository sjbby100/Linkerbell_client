import React, { useEffect } from "react";
import { Platform } from "react-native";
import { LoginValue } from "../models/LoginTypes";
import { InputForm } from "../styles/Input";
import { InputWrapper } from "../styles/InputWrapper";
import { isEmail } from "../core/utils/emailValidate";
import { style } from "../styles/SigninStyles/StyleIndex";
import useAuth from "../hooks/useAuth";
const { SubText } = style;

type stringOrNull = string | null;
type InputProps = {
  name: string;
  onChange: React.Dispatch<React.SetStateAction<LoginValue>>;
  value: LoginValue;
};
type err = {
  email: stringOrNull;
  password: stringOrNull;
  passwordCheck: stringOrNull;
  [key: string]: null | string;
};

const Input = ({ name, onChange, value }: InputProps): JSX.Element => {
  const inputTitle = name === "email" ? "이메일" : "비밀번호";
  const placeholderKeyword = `${inputTitle}${name === "email" ? "을" : "를"}`;
  const signUpPlaceholder = `${placeholderKeyword} ${
    name === "passwordCheck" ? "다시 " : ""
  }`;
  const limit = name === "email" ? "" : "(8자 이상)";
  const { err: requestError } = useAuth();

  useEffect(() => {
    const err = { ...value.err };
    if (requestError === "check_email") {
      err.email = "request wrong email";
    }
    if (requestError === "check_pw") {
      err.password = "request wrong password";
    }
    onChange({ ...value, err });
  }, [requestError]);

  const renderSubText = (err: err): JSX.Element => {
    let text = inputTitle;
    if (name in err) {
      if (name === "email") {
        if (err[name] === `wrong ${name}`) {
          text = "이메일 형식이 잘못되었습니다";
          return (
            <SubText danger={true} OS={Platform.OS}>
              {text}
            </SubText>
          );
        } else if (err[name] === `request wrong ${name}`) {
          text = "존재하지 않는 이메일 입니다";
          return (
            <SubText danger={true} OS={Platform.OS}>
              {text}
            </SubText>
          );
        }
      }
      if (name === "password" && err[name] === `request wrong ${name}`) {
        text = "잘못된 비밀번호 입니다.";
        return (
          <SubText danger={true} OS={Platform.OS}>
            {text}
          </SubText>
        );
      }
      if (name === "passwordCheck" && err[name] === "different password") {
        text = "비밀번호가 다릅니다";
        return (
          <SubText danger={true} OS={Platform.OS}>
            {text}
          </SubText>
        );
      }
    }

    return (
      <SubText OS={Platform.OS}>
        {name === "passwordCheck" ? text + " 확인" : text}
      </SubText>
    );
  };

  const validateEmail = () => {
    if (name === "email" && value.email.length !== 0) {
      const err = { ...value.err };
      if (!isEmail(value.email)) {
        err.email = "wrong email";
      } else {
        delete err.email;
      }
      onChange({ ...value, err });
    }
  };

  const checkPassword = () => {
    const passwordCheck = value.passwordCheck ? value.passwordCheck : "";
    if (name === "passwordCheck" && passwordCheck.length !== 0) {
      const err = { ...value.err };
      if (passwordCheck !== value.password) {
        err.passwordCheck = "unmatched password";
      } else {
        delete err.passwordCheck;
      }
      onChange({ ...value, err });
    }
  };

  const initValidateEmail = () => {
    const err = { ...value.err };
    if (name === "email" && err.email === "wrong email") {
      delete err.email;
    }
    onChange({ ...value, err });
  };

  return (
    <InputWrapper>
      {renderSubText(value.err)}
      <InputForm
        autoCapitalize="none"
        OS={Platform.OS}
        placeholder={`${signUpPlaceholder} 입력해주세요 ${limit}`}
        onChangeText={(val) => onChange({ ...value, [name]: val })}
        onFocus={() => initValidateEmail()}
        onBlur={() => (name === "email" ? validateEmail() : checkPassword())}
        secureTextEntry={
          name === "password" || name === "passwordCheck" ? true : false
        }
      ></InputForm>
    </InputWrapper>
  );
};

export default Input;
