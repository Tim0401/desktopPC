$methods = @'
[return: MarshalAs(UnmanagedType.Bool)]
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern bool PostMessage(uint hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

[DllImport("user32.dll", SetLastError = true)]
public static extern bool LockWorkStation();


[DllImport("user32.dll", SetLastError = true)]
static extern uint SendInput(int nInputs, INPUT[] pInputs, int cbsize);

[StructLayout(LayoutKind.Sequential)]
  struct INPUT
  { 
    public int        type; // 0 = INPUT_MOUSE(デフォルト),
                            // 1 = INPUT_KEYBOARD
    public MOUSEINPUT mi;
  }

[StructLayout(LayoutKind.Sequential)]
  struct MOUSEINPUT
  {
    public int    dx ;
    public int    dy ;
    public int    mouseData ;  // amount of wheel movement
    public int    dwFlags;
    public int    time;        // time stamp for the event
    public IntPtr dwExtraInfo;
  }

public static void Click() {
	INPUT[] input = new INPUT[1];
	input[0].mi.dx = 1;
	input[0].mi.dy = 1;
	input[0].mi.dwFlags = 0x0001  | 0x8000 ;
	SendInput(1,input, Marshal.SizeOf(input[0]));
}

'@

$pwm = Add-Type -MemberDefinition $methods -Name "PowerManager" -PassThru -Language CSharp

$pwm[0]::PostMessage(0xffff, 0x0112, 0xf170, -1)

$pwm[0]::Click()
# $pwm::LockWorkStation()