/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { jsonParseWithDate, jsonParseWithUrl } from "../../json/JsonParse";

describe("utils::jsonParseWithDate", () => {
  it("should parse JSON strings with dates properly", () => {
    const myObject = {
      myNumber: 1,
      myString: "myValue",
      myBoolean: false,
      myUndefined: undefined,
      myObject: {
        myNumber: 2,
        myDate: Date.now(),
      },
      myDateOne: Date.now(),
      myDateTwo: new Date(Date.UTC(2021, 8, 18, 7, 59, 0, 0)),
      myDateThree: new Date(),
      myDateFour: new Date("August 18, 2021 07:59:00"),
      myDateFive: new Date("2021-08-18T07:59:00"),
      myDateSix: new Date(2021, 8, 18),
      myDateSeven: new Date(2021, 8, 18, 7, 59, 0),
    };
    const json = JSON.stringify(myObject);
    expect(JSON.parse(json)).not.toEqual(myObject);
    expect(jsonParseWithDate(json)).toEqual(myObject);
  });
});

describe("utils::jsonParseWithUrl", () => {
  it("should parse JSON strings with URLs properly", () => {
    const myObject = {
      myNumber: 1,
      myString: "myValue",
      myBoolean: false,
      myUndefined: undefined,
      myDate: Date.now(),
      myObject: {
        myNumber: 2,
        myUrl: new URL("https://github.com/kiegroup/kogito-tooling"),
      },
      myUrlOne: new URL("https://www.example.com"),
      myUrlTwo: new URL("http://www.example.com/path/to/file.txt"),
      myUrlThree: new URL("https://www.example.com/path/to/file.txt?param1=value1&param2=value2"),
      myUrlFour: new URL("http://www.example.com/path/to/file.txt#anchor"),
      myUrlFive: new URL("https://www.example.com/path/to/file.txt?param1=value1&param2=value2#anchor"),
    };
    const json = JSON.stringify(myObject);
    expect(JSON.parse(json)).not.toEqual(myObject);
    expect(jsonParseWithUrl(json)).toEqual(myObject);
  });
});
