/* eslint-disable no-undef */
(function(d, g) {
  var f = "3.0.0.1a";
  var c = function() {
      return c.fn.init.apply(c.fn, arguments)
  };
  c.prototype = c.fn = {
      init: function() {
          return this
      },
      objectFromString: function(m) {
          if (typeof m === "string" && m.length > 1) {
              var j = m.substr(0, 1);
              var i = m.substr(-1);
              if ((j === "{" && i === "}") || (j === "[" || i === "]")) {
                  try {
                      var l = JSON.parse(m);
                      for (var h in l) {
                          l[h] = c.fn.objectFromString(l[h])
                      }
                      return l
                  } catch (k) {
                      console.error(k);
                      return m
                  }
              }
          }
          return m
      },
      version: {
          core: f
      }
  };
  c.Constant = {};
  var e = function() {
    var i = d.navigator.userAgent.toLowerCase();
    var h = d.navigator.platform.toLowerCase();
    return {
      os: function(j) {
          if (j === g) {
              return this.device().os
          }
          return this.device(j)
      },
      device: function(n, l) {
        var m;
        if (n === g) {
          m = {
            os: "unknown",
            version: "",
            tablet: false,
            mobile: false
          };
          if (i.match(/emulator/i)) {
            m.os = "Emulator";
            l = /Emulator ([\.\_\d]+)/i.exec(i);
            m.version = (l) ? l[1] : "";
            m.mobile = true
          } else {
            if (i.match(/android/i)) {
              m.os = "Android";
              if (!i.match(/mobile/i)) {
                m.tablet = true
              }
              l = /Android ([\.\_\d]+)/i.exec(i);
              m.version = (l) ? l[1] : "";
              m.mobile = true
            } else {
              if (i.match(/blackberry/i)) {
                m.os = "BlackBerry";
                m.mobile = true
              } else {
                if (i.match(/iphone|ipad|ipod/i)) {
                  m.os = "iOS";
                  if (i.match(/ipad/i)) {
                    m.tablet = true
                  }
                  l = /OS (\d+)_(\d+)_?(\d+)?/i.exec(d.navigator.appVersion);
                  m.version = l[1] + "." + l[2] + "." + (l[3] | 0);
                  m.mobile = true
                } else {
                  if (i.match(/opera mini/i)) {
                    m.os = "Opera";
                    m.mobile = true
                  } else {
                    if (i.match(/iemobile|windows/i)) {
                      m.os = "Windows";
                      m.mobile = true
                    } else {
                      if (i.match(/Webos/i)) {
                        m.os = "Webos";
                        m.mobile = true
                      }
                    }
                  }
                }
              }
            }
          }
          return m
        }
        m = this.device();
        var k = m.os.match(new RegExp(n, "i")) ? true : false;
        if (l === g) {
            return k
        }
        var j = m.version.match(new RegExp(l, "i")) ? true : false;
        return k && j
      },
      browser: function(j, o) {
        var m;
        if (j === g) {
          m = {
            name: "",
            version: ""
          };
          m.name = (/chrome/gi).test(i) ? "chrome" : (/safari/gi).test(i) ? "safari" : (/simulator/gi).test(i) ? "ios simulator" : (/firefox/gi).test(i) ? "firefox" : (/triden/gi).test(i) ? "ie" : (/presto/gi).test(i) ? "opera" : "other";
          var r = i.match(/version\/([0-9.]+)/ig) || "";
          var p = i.match(/chrome\/([0-9.]+)/ig) || "";
          var l = i.match(/firefox\/([0-9.]+)/ig) || "";
          var k = i.match(/MSIE ([0-9.]+)/ig) || "";
          m.version = m.name === "safari" ? r.toString().split("/")[1] : m.name === "opera" ? r.toString().split("/")[1] : m.name === "chrome" ? p.toString().split("/")[1] : m.name === "firefox" ? l.toString().split("/")[1] : m.name === "ie" ? k.toString().split(" ")[1] : "";
          return m
        }
        m = this.browser();
        var n = m.name.match(new RegExp(j, "i")) ? true : false;
        if (o === g) {
          return n
        }
        var q = m.version.match(new RegExp(o, "i")) ? true : false;
        return n && q
      }
    }
  };
  c.navigator = c.fn.navigator = new e();
  c.Constant.INTERFACE_TYPE = {
      Unknown: "Unknown",
      iOS: "iOS",
      Android: "Android",
  };
  c.interfaceType = c.fn.interfaceType = (function() {
      var h = c.Constant.INTERFACE_TYPE.Unknown;
      if (c.navigator.device("ios")) {
          h = c.Constant.INTERFACE_TYPE.iOS
      } else {
          if (c.navigator.device("android")) {
              h = c.Constant.INTERFACE_TYPE.Android
          }
      }
      return h
  })();
  var b = function b(i) {
      var k = {
          async: false,
          command: "",
          params: [],
          data: {},
          error: false,
          errorMessage: ""
      };
      if (arguments.length === 0 || i.length === 0) {
          return k
      }
      i = Array.prototype.slice.call(i, 0);
      var j = i.shift();
      if (typeof j !== "object" && typeof j !== "string") {
          return k
      } else {
          if (typeof j === "object" && (j.command === g || typeof j.command !== "string")) {
              return k
          }
      }
      if (typeof j === "object") {
          var h = j;
          k.command = h.command || "";
          k.params = (h.params !== g && h.params.length !== g && h.params.length > 0) ? h.params : [];
          k.async = h.async === true ? true : false
      } else {
          if (typeof j === "string") {
              k.command = j;
              k.params = i
          } else {
              return k
          }
      }
      return k
  };
  c.fn.execute = function a() {
      var k = new b(arguments);
      const osInfo = mInterFaceOsType()
      if (osInfo.osType == 1 || osInfo.osType == 3) {
        // 의사회원 브라우저 경우
        console.log("browsers Not supported");
        return
      }
      if (!k.command) {
          console.error("command is undefined");
          return
      }
      var i = function() {
          if (c.interfaceType === c.Constant.INTERFACE_TYPE.iOS) {
              var m, o, l, n;
              m = "minterface://";
              o = [];
              o.push("method=" + k.command);
              if (k.params.length > 0) {
                for (l = 0; l < k.params.length; l++) {
                  n = k.params[l] || "";
                  n = (typeof(n) === "object") ? JSON.stringify(n) : (typeof(n) !== "string") ? n.toString() : n;
                  o.push("param" + (l + 1) + "=" + encodeURIComponent(n))
                }
              }
              m += "?" + o.join("&");
              if (k.async === false) {
                return prompt(m)
              }
              return alert(m)
              /*
              this.M.navigator.device()
              {
                "os": "Windows",
                "version": "",
                "tablet": false,
                "mobile": true
              }
              this.M.navigator.browser()
              {
                  "name": "chrome",
                  "version": "99.0.4844.51"
              }
              */
          } else {
            if (c.interfaceType === c.Constant.INTERFACE_TYPE.Android) {
              if (d.MNativeInterface && MNativeInterface[k.command]) {
                return MNativeInterface[k.command].apply(MNativeInterface, k.params)
              }
              return
            }
          }
          return
      };
      try {
          if (k.async === false) {
            var h = i();
            return typeof h === "string" ? c.fn.objectFromString(h) : h
          }
          setTimeout(function() {
              i()
          }, 0)
      } catch (j) {
          console.error(j);
          return
      }
      return k
  };
  d.M = new c()
})(window);

function mInterFaceOsInfoDev() {
  const agent = navigator.userAgent
  let AgentUserOs= agent.replace(/ /g,'');
  var OsNo = agent.toLowerCase()
  let os = {
    Linux: /linux/.test(OsNo),
    Unix: /x11/.test(OsNo),
    Mac: /mac/.test(OsNo),
    Windows: /win/.test(OsNo)
  }
  let OSName = null
  let OSVers = null
  if(os.Windows) {
    if(AgentUserOs.indexOf("WindowsCE") != -1) OSName="Windows CE";
    else if(AgentUserOs.indexOf("Windows95") != -1) OSName="Windows 95";
    else if(AgentUserOs.indexOf("Windows98") != -1) {
      if (AgentUserOs.indexOf("Win9x4.90") != -1) OSName="Windows Millennium Edition (Windows Me)"
      else OSName="Windows 98";
    } else if(AgentUserOs.indexOf("WindowsNT4.0") != -1) OSName="Microsoft Windows NT 4.0";
    else if(AgentUserOs.indexOf("WindowsNT5.0") != -1) OSName="Windows 2000";
    else if(AgentUserOs.indexOf("WindowsNT5.01") != -1) OSName="Windows 2000, Service Pack 1 (SP1)";
    else if(AgentUserOs.indexOf("WindowsNT5.1") != -1) OSName="Windows XP";
    else if(AgentUserOs.indexOf("WindowsNT5.2") != -1) OSName="Windows 2003";
    else if(AgentUserOs.indexOf("WindowsNT6.0") != -1) OSName="Windows Vista/Server 2008";
    else if(AgentUserOs.indexOf("WindowsNT6.1") != -1) OSName="Windows 7";
    else if(AgentUserOs.indexOf("WindowsNT6.2") != -1) OSName="Windows 8";
    else if(AgentUserOs.indexOf("WindowsNT6.3") != -1) OSName="Windows 8.1";
    else if(AgentUserOs.indexOf("WindowsPhone8.0") != -1) OSName="Windows Phone 8.0";
    else if(AgentUserOs.indexOf("WindowsPhoneOS7.5") != -1) OSName="Windows Phone OS 7.5";
    else if(AgentUserOs.indexOf("Xbox") != -1) OSName="Xbox 360";
    else if(AgentUserOs.indexOf("XboxOne") != -1) OSName="Xbox One";
    else if(AgentUserOs.indexOf("Win16") != -1) OSName="Windows 3.x";
    else if(AgentUserOs.indexOf("ARM") != -1) OSName="Windows RT";
    else OSName="Windows (Unknown)";
    if(AgentUserOs.indexOf("WOW64") != -1) OSVers=" 64-bit(s/w 32-bit)";
    else if(AgentUserOs.indexOf("Win64;x64;") != -1) OSVers=" 64-bit(s/w 64-bit)";
    else if(AgentUserOs.indexOf("Win16") != -1) OSVers=" 16-bit";
    else OSVers=" 32-bit";
  } else if (os.Linux) {
    if(AgentUserOs.indexOf("Android") != -1) {
      var regex = /Android (.*);.*;\s*(.*)\sBuild/;
      var match = regex.exec(agent);
      if(match) {
        var ver = match[1];
        var dev_name = match[2];
        return "Android " + ver + " " + dev_name;
      } return "Android OS";
    }
    else if(AgentUserOs.indexOf("BlackBerry9000") != -1) OSName="BlackBerry9000";
    else if(AgentUserOs.indexOf("BlackBerry9300") != -1) OSName="BlackBerry9300";
    else if(AgentUserOs.indexOf("BlackBerry9700") != -1) OSName="BlackBerry9700";
    else if(AgentUserOs.indexOf("BlackBerry9780") != -1) OSName="BlackBerry9780";
    else if(AgentUserOs.indexOf("BlackBerry9900") != -1) OSName="BlackBerry9900";
    else if(AgentUserOs.indexOf("BlackBerry;Opera Mini") != -1) OSName="Opera/9.80";
    else if(AgentUserOs.indexOf("Symbian/3") != -1) OSName="Symbian OS3";
    else if(AgentUserOs.indexOf("SymbianOS/6") != -1) OSName="Symbian OS6";
    else if(AgentUserOs.indexOf("SymbianOS/9") != -1) OSName="Symbian OS9";
    else if(AgentUserOs.indexOf("Ubuntu") != -1) OSName="Ubuntu";
    else if(AgentUserOs.indexOf("PDA") != -1) OSName="PDA";
    else if(AgentUserOs.indexOf("NintendoWii") != -1) OSName="Nintendo Wii";
    else if(AgentUserOs.indexOf("PSP") != -1) OSName="PlayStation Portable";
    else if(AgentUserOs.indexOf("PS2;") != -1) OSName="PlayStation 2";
    else if(AgentUserOs.indexOf("PLAYSTATION3") != -1) OSName="PlayStation 3";
    else OSName="Linux (Unknown)";

    if(AgentUserOs.indexOf("x86_64") != -1) OSVers=" 64-bit";
    else if(AgentUserOs.indexOf("i386") != -1) OSVers=" 32-bit";
    else if(AgentUserOs.indexOf("IA-32") != -1) OSVers=" 32-bit";
    else OSVers="";
  } else if (os.Unix) {
    OSName="UNIX";
  } else if (os.Mac) {
    if(AgentUserOs.indexOf("iPhone") != -1) {
      if(AgentUserOs.indexOf("iPhoneOS3") != -1) OSName="iPhone OS 3";
      else if(AgentUserOs.indexOf("iPhoneOS4") != -1) OSName="iPhone OS 4";
      else if(AgentUserOs.indexOf("iPhoneOS5") != -1) OSName="iPhone OS 5";
      else if(AgentUserOs.indexOf("iPhoneOS6") != -1) OSName="iPhone OS 6";
      else OSName="iPhone";
    } else if(AgentUserOs.indexOf("iPad") != -1) {
      OSName="iPad";
    } else if(AgentUserOs.indexOf("MacOS") != -1) {
      if(AgentUserOs.indexOf("Macintosh") != -1) OSName="Macintosh";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.1")) != -1) OSName="Mac OS X Puma";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.2")) != -1) OSName="Mac OS X Jaguar";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.3")) != -1) OSName="Mac OS X Panther";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.4")) != -1) OSName="Mac OS X Tiger";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.5")) != -1) OSName="Mac OS X Leopard";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.6")) != -1) OSName="Mac OS X Snow Leopard";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.7")) != -1) OSName="Mac OS X Lion";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.8")) != -1) OSName="Mac OS X Mountain Lion";
      else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.9")) != -1) OSName="Mac OS X Mavericks";
    } else {
      OSName="MacOS (Unknown)";
    }
  } else {
    OSName="Unknown OS";
  }
  var OSDev = OSName + OSVers;
  return OSDev;
}

function mInterFaceOsType() {
  let osInfo = {
    osType: null,         // 사용자 운영체제(1:web, 2:mobile, 3:web&mobile)
    mobileOsType: null,   // 사용자 모바일 운영체제(1:iOS, 2:AOS) - 모바일 사용자만 필수
  }
  var devName = mInterFaceOsInfoDev()
  const agent = navigator.userAgent
  if(devName.indexOf("MacOS") > -1 || devName.indexOf("iPhone") > -1 || devName.indexOf("iPad") > -1) {
    if(agent.indexOf("Safari") > -1 || agent.indexOf("NAVER") > -1 || agent.indexOf("KAKAOTALK") > -1) osInfo.osType = 3
    else osInfo.osType = 2
    osInfo.mobileOsType = 1
  } else if(devName.indexOf("Android") > -1) {
    if(agent.indexOf("wv") > -1) {
      if(agent.indexOf("NAVER") > -1 || agent.indexOf("KAKAOTALK") > -1) osInfo.osType = 3
      else osInfo.osType = 2
    } else {
      osInfo.osType = 3
    }
    osInfo.mobileOsType = 2
  } else if(devName.indexOf("Macintosh") > -1) {
    var touchTime = `${navigator.maxTouchPoints}`
    if(touchTime == 0) {
      osInfo.osType = 1
    } else if(touchTime == 5) {
      if(agent.indexOf("Safari") > -1 || agent.indexOf("NAVER") > -1 || agent.indexOf("KAKAOTALK") > -1) osInfo.osType = 3
      else osInfo.osType = 2
      osInfo.mobileOsType = 1
    }
  } else {
    osInfo.osType = 1
  }
  return osInfo
}
