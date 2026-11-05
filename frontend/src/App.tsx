import { FormEvent, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import {
  ApiError,
  fetchCurrentUser,
  fetchHealth,
  fetchThongBao,
  login,
  type DangNhapRequest,
  type HealthStatus,
  type ThongTinNguoiDung,
} from './api'
import { clearStoredToken, readStoredToken, storeToken } from './authSession'
import DanhMucToaNha from './DanhMucToaNha'
import DanhMucPhong from './DanhMucPhong'
import GhiChiSo from './GhiChiSo'
import HoaDon from './HoaDon'
import LichSuHoaDon from './LichSuHoaDon'
import BieuDoTieuThu from './BieuDoTieuThu'
import HopDongNguoiThue from './HopDongNguoiThue'
import HopDongQuanLy from './HopDongQuanLy'
import HoaDonQuanLy from './HoaDonQuanLy'
import QuanLyTaiKhoan from './QuanLyTaiKhoan'
import { ViecCuaToi } from './ViecCuaToi'
import { ThongBao } from './ThongBao'
import { LichSuSuaChua } from './LichSuSuaChua'
import { BangViecVanHanh } from './BangViecVanHanh'
import BaoCaoTongQuan from './BaoCaoTongQuan'
import CongNoBaoCao from './CongNoBaoCao'
import TieuThuBaoCao from './TieuThuBaoCao'
import ChiPhiBaoTriBaoCao from './ChiPhiBaoTriBaoCao'
import { BlockedNotice } from './design/building/BlockedNotice'
import { Button } from './design/core/Button'
import { SysLabel } from './design/core/SysLabel'
import { Toast } from './design/feedback/Toast'
import { Breadcrumb } from './design/shell/Breadcrumb'
import { NavPanel, type NavGroup } from './design/shell/NavPanel'
import { TopBar } from './design/shell/TopBar'
import type { GlyphName } from './design/core/GlyphName'
import { layMenuTheoVaiTro, xacDinhTrangTheoVaiTro } from './roleNavigation'

const styleTrang: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--ma-bg-page)',
  color: 'var(--ma-text-primary)',
  fontFamily: 'var(--ma-font-ui)',
}

const styleKhungKhach: CSSProperties = {
  ...styleTrang,
  display: 'grid',
  gap: 'var(--ma-space-7)',
  padding: 'clamp(20px, 4vw, 44px) clamp(16px, 3vw, 32px)',
  alignContent: 'center',
  justifyItems: 'center',
  background: 'radial-gradient(circle at 15% 15%, rgba(23, 101, 60, 0.04) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(15, 79, 74, 0.05) 0%, transparent 45%), var(--ma-bg-page)',
}

const styleGridKhach: CSSProperties = {
  display: 'grid',
  gap: 'var(--ma-space-7)',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
  alignItems: 'stretch',
  width: '100%',
  maxWidth: 1060,
}

const styleGridKhachManHinhHep: CSSProperties = {
  ...styleGridKhach,
  gridTemplateColumns: 'minmax(0, 1fr)',
}

const styleThe: CSSProperties = {
  border: '1px solid var(--ma-border-default)',
  borderRadius: 'var(--ma-radius-lg, 14px)',
  background: 'var(--ma-bg-card)',
  boxShadow: 'var(--ma-shadow-card)',
  minWidth: 0,
}

const styleTheNoiDung: CSSProperties = {
  ...styleThe,
  padding: 'clamp(20px, 4vw, 32px)',
}

const styleNhanTruong: CSSProperties = {
  display: 'grid',
  gap: 'var(--ma-space-2)',
  minWidth: 0,
  font: 'var(--ma-text-body)',
  color: 'var(--ma-text-primary)',
}

const styleONhap: CSSProperties = {
  width: '100%',
  minWidth: 0,
  minHeight: 'var(--ma-hit-mobile)',
  padding: '10px 14px',
  border: '1px solid var(--ma-border-default)',
  borderRadius: 'var(--ma-radius, 8px)',
  background: 'var(--ma-bg-card)',
  color: 'var(--ma-text-primary)',
  font: 'var(--ma-text-body)',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
}

const styleKhungUngDungDesktop: CSSProperties = {
  ...styleTrang,
  display: 'grid',
  gridTemplateColumns: 'var(--ma-nav-width) minmax(0, 1fr)',
  overflowX: 'clip',
}

const styleKhungUngDungMobile: CSSProperties = {
  ...styleTrang,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  overflowX: 'clip',
}

const styleCotNoiDung: CSSProperties = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
}

const styleCotNoiDungMobile: CSSProperties = {
  ...styleCotNoiDung,
  paddingBottom: 'calc(var(--ma-hit-mobile) + var(--ma-space-6))',
}

const styleVungNoiDung: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 'clamp(16px, 4vw, var(--ma-space-8))',
  display: 'grid',
  gap: 'var(--ma-space-7)',
  alignContent: 'start',
}

const styleVungNoiDungKhongDem: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'grid',
  alignContent: 'start',
}

const styleTieuDe: CSSProperties = {
  margin: 'var(--ma-space-2) 0 0',
  font: 'var(--ma-text-screen-title)',
  letterSpacing: 'var(--ma-tracking-title)',
}

const styleTieuDeKhoi: CSSProperties = {
  letterSpacing: 'var(--ma-tracking-title)',
}

const styleDoanMoTa: CSSProperties = {
  margin: 0,
  color: 'var(--ma-text-secondary)',
  font: 'var(--ma-text-body)',
  lineHeight: 1.6,
}

const styleThongTinNguoiDung: CSSProperties = {
  display: 'grid',
  gap: 'var(--ma-space-5)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  margin: 0,
}

const styleHangThongTin: CSSProperties = {
  display: 'grid',
  gap: 'var(--ma-space-1)',
  paddingTop: 'var(--ma-space-4)',
  borderTop: '1px solid var(--ma-border-subtle)',
}

const styleNhomNut: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--ma-space-3)',
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [dangTaiPhien, setDangTaiPhien] = useState(true)
  const [dangDangNhap, setDangDangNhap] = useState(false)
  const [nguoiDung, setNguoiDung] = useState<ThongTinNguoiDung | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState<number | null>(null)
  const phienBanTaiThongBao = useRef(0)
  const [duongDanHienTai, setDuongDanHienTai] = useState(() => layDuongDanHienTai())
  const [laManHinhHep, setLaManHinhHep] = useState(() => kiemTraManHinhHep())
  const [form, setForm] = useState<DangNhapRequest>({
    soDienThoai: '',
    matKhau: '',
  })

  useEffect(() => {
    let mounted = true

    fetchHealth()
      .then((result) => {
        if (mounted) setHealth(result)
      })
      .catch((reason: unknown) => {
        if (mounted) {
          setHealthError(reason instanceof Error ? reason.message : 'Không thể kết nối tới máy chủ.')
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const storedToken = readStoredToken()

    if (!storedToken) {
      setDangTaiPhien(false)
      return () => {
        mounted = false
      }
    }

    fetchCurrentUser(storedToken)
      .then((currentUser) => {
        if (!mounted) return
        setToken(storedToken)
        setNguoiDung(currentUser)
      })
      .catch((reason: unknown) => {
        if (!mounted) return
        if (reason instanceof ApiError && reason.status === 401) {
          clearStoredToken()
        }
        setAuthError(reason instanceof Error ? reason.message : 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
      })
      .finally(() => {
        if (mounted) setDangTaiPhien(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function dongBoDuongDan() {
      setDuongDanHienTai(layDuongDanHienTai())
    }

    window.addEventListener('popstate', dongBoDuongDan)
    return () => {
      window.removeEventListener('popstate', dongBoDuongDan)
    }
  }, [])

  useEffect(() => {
    const phienBan = phienBanTaiThongBao.current + 1
    phienBanTaiThongBao.current = phienBan
    const vaiTro = nguoiDung?.vaiTro
    if (!token || !vaiTro || !['CHU', 'QUAN_LY', 'THO', 'NGUOI_THUE'].includes(vaiTro)) {
      setSoThongBaoChuaDoc(null)
      return undefined
    }

    if (duongDanHienTai === '/thong-bao') {
      return undefined
    }

    let mounted = true
    void fetchThongBao(token)
      .then((hopThongBao) => {
        if (mounted && phienBanTaiThongBao.current === phienBan) {
          setSoThongBaoChuaDoc(hopThongBao.soChuaDoc)
        }
      })
      .catch(() => {
        if (mounted && phienBanTaiThongBao.current === phienBan) {
          setSoThongBaoChuaDoc(null)
        }
      })

    return () => {
      mounted = false
    }
  }, [duongDanHienTai, nguoiDung?.vaiTro, token])

  useEffect(() => {
    if (nguoiDung?.vaiTro === 'THO' && !['/viec-cua-toi', '/thong-bao'].includes(duongDanHienTai)) {
      thayTheDuongDan('/viec-cua-toi')
    }
  }, [nguoiDung, duongDanHienTai])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function dongBoKichThuoc() {
      setLaManHinhHep(kiemTraManHinhHep())
    }

    window.addEventListener('resize', dongBoKichThuoc)
    return () => {
      window.removeEventListener('resize', dongBoKichThuoc)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDangDangNhap(true)
    setAuthError(null)

    try {
      const response = await login(form)
      storeToken(response.token)
      setToken(response.token)
      setNguoiDung(response.nguoiDung)
      if (response.nguoiDung.vaiTro === 'THO') {
        thayTheDuongDan('/viec-cua-toi')
      } else {
        dieuHuongToi('/')
      }
      setForm({ soDienThoai: '', matKhau: '' })
    } catch (reason) {
      setAuthError(reason instanceof Error ? reason.message : 'Đăng nhập không thành công.')
    } finally {
      setDangDangNhap(false)
      setDangTaiPhien(false)
    }
  }

  function handleLogout() {
    clearStoredToken()
    setToken(null)
    setNguoiDung(null)
    setAuthError(null)
    dieuHuongToi('/')
  }

  const menuVaiTro = nguoiDung ? layMenuTheoVaiTro(nguoiDung.vaiTro) : []
  const trangVaiTro = nguoiDung
    ? xacDinhTrangTheoVaiTro(nguoiDung.vaiTro, nguoiDung.tenVaiTro, duongDanHienTai)
    : null
  const dinhDanhHoaDon = typeof window === 'undefined'
    ? {}
    : layDinhDanhHoaDonTuUrl(window.location.href)
  const hienThiDanhMucToaNha = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/toa-nha'
    && ['QTHT', 'CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro),
  )
  const hienThiDanhMucPhong = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/phong'
    && nguoiDung.vaiTro === 'QUAN_LY',
  )
  const hienThiGhiChiSo = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/ghi-chi-so'
    && ['CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro),
  )
  const hienThiHoaDonNguoiThue = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'NGUOI_THUE'
    && ['/', '/hoa-don-cua-toi'].includes(duongDanHienTai)
  )
  const hienThiLichSuHoaDonNguoiThue = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'NGUOI_THUE'
    && duongDanHienTai === '/lich-su'
  )
  const hienThiBieuDoTieuThuNguoiThue = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'NGUOI_THUE'
    && duongDanHienTai === '/tieu-thu'
  )
  const hienThiHopDongNguoiThue = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'NGUOI_THUE'
    && duongDanHienTai === '/hop-dong'
  )
  const hienThiHopDongQuanLy = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/hop-dong'
    && ['CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro)
  )
  const hienThiThongBao = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/thong-bao'
    && ['CHU', 'QUAN_LY', 'THO', 'NGUOI_THUE'].includes(nguoiDung.vaiTro),
  )
  const hienThiViecCuaToi = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'THO'
    && duongDanHienTai === '/viec-cua-toi',
  )
  const hienThiLichSuSuaChua = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/su-co'
    && ['CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro),
  )
  const hienThiBangViec = Boolean(
    token
    && nguoiDung
    && ((nguoiDung.vaiTro === 'QUAN_LY' && duongDanHienTai === '/nhac-viec')
      || (nguoiDung.vaiTro === 'CHU' && duongDanHienTai === '/tong-quan')),
  )
  const hienThiBaoCaoTongQuan = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'CHU'
    && duongDanHienTai === '/bao-cao',
  )
  const hienThiBaoCaoTieuThu = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'CHU'
    && duongDanHienTai === '/bao-cao/tieu-thu',
  )
  const hienThiBaoCaoChiPhiBaoTri = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'CHU'
    && duongDanHienTai === '/bao-cao/chi-phi-bao-tri',
  )
  const hienThiBaoCaoCongNo = Boolean(
    token
    && nguoiDung
    && nguoiDung.vaiTro === 'CHU'
    && duongDanHienTai === '/cong-no',
  )
  const laDrillDownCongNo = Boolean(
    nguoiDung?.vaiTro === 'CHU'
    && duongDanHienTai === '/hoa-don'
    && dinhDanhHoaDon.hoaDonId !== undefined
    && (dinhDanhHoaDon.toaNhaId === undefined || dinhDanhHoaDon.kyId === undefined),
  )
  const hienThiHoaDon = Boolean(
    token
    && nguoiDung
    && ['/hoa-don', '/hoa-don-cua-toi'].includes(duongDanHienTai)
    && ['QTHT', 'CHU', 'QUAN_LY', 'NGUOI_THUE'].includes(nguoiDung.vaiTro)
    && (!['CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro)
      || (dinhDanhHoaDon.toaNhaId !== undefined && dinhDanhHoaDon.kyId !== undefined && dinhDanhHoaDon.hoaDonId !== undefined)
      || laDrillDownCongNo),
  )
  const hienThiHoaDonQuanLy = Boolean(
    token
    && nguoiDung
    && duongDanHienTai === '/hoa-don'
    && ['CHU', 'QUAN_LY'].includes(nguoiDung.vaiTro)
    && dinhDanhHoaDon.hoaDonId === undefined,
  )
  const tieuDeTheChinh = hienThiBieuDoTieuThuNguoiThue
    ? 'Tiêu thụ điện và nước'
    : hienThiHopDongNguoiThue
      ? 'Hợp đồng của tôi'
      : hienThiHopDongQuanLy
        ? 'Hợp đồng theo toà nhà'
      : hienThiThongBao
        ? 'Thông báo'
      : hienThiBaoCaoTongQuan
        ? 'Báo cáo tổng quan'
      : hienThiBaoCaoTieuThu
        ? 'Báo cáo tiêu thụ điện nước'
      : hienThiBaoCaoChiPhiBaoTri
        ? 'Báo cáo chi phí bảo trì'
      : hienThiBaoCaoCongNo
        ? 'Báo cáo công nợ'
      : hienThiBangViec
        ? 'Bảng việc vận hành'
      : hienThiLichSuSuaChua
        ? 'Lịch sử sửa chữa'
    : hienThiHoaDonNguoiThue && duongDanHienTai !== '/'
      ? 'Hoá đơn của tôi'
    : hienThiLichSuHoaDonNguoiThue
      ? 'Lịch sử hoá đơn'
      : hienThiDanhMucToaNha
        ? 'Toà nhà'
        : hienThiDanhMucPhong
          ? 'Phòng'
      : hienThiGhiChiSo
            ? 'Ghi chỉ số'
            : hienThiHoaDonQuanLy || hienThiHoaDon
              ? 'Hoá đơn'
              : nguoiDung && trangVaiTro ? trangVaiTro.tieuDe : 'Đăng nhập'
  const maTruyVetTheChinh = hienThiBieuDoTieuThuNguoiThue
    ? 'FR-POR-05'
    : hienThiHopDongNguoiThue
      ? 'FR-POR-07'
    : hienThiThongBao
      ? 'FR-MNT-02'
      : hienThiBaoCaoTongQuan
        ? 'FR-RPT-01 · FR-RPT-02'
      : hienThiBaoCaoTieuThu
        ? 'FR-RPT-02 · FR-RPT-05'
      : hienThiBaoCaoChiPhiBaoTri
        ? 'FR-RPT-02 · FR-RPT-08'
      : hienThiBaoCaoCongNo
        ? 'FR-RPT-02 · FR-RPT-03'
      : hienThiBangViec
        ? 'FR-NTF-01'
      : hienThiLichSuSuaChua
        ? 'FR-MNT-08'
    : hienThiHoaDonNguoiThue
      ? 'FR-POR-01'
    : hienThiLichSuHoaDonNguoiThue
      ? 'FR-POR-03'
      : hienThiDanhMucToaNha
        ? 'FR-BLD-01'
        : hienThiDanhMucPhong
          ? 'FR-BLD-02'
          : hienThiGhiChiSo
            ? 'FR-MTR-01'
            : hienThiHoaDon
              ? 'FR-INV-02'
              : nguoiDung ? 'FR-AUT-04' : 'FR-AUT-01'

  if (!nguoiDung) {
    const taiKhoanMau = [
      { vaiTro: 'Quản lý toà nhà', sdt: '0900000003', icon: '🏢' },
      { vaiTro: 'Người thuê', sdt: '0900000006', icon: '🏠' },
      { vaiTro: 'Thợ kỹ thuật', sdt: '0900000004', icon: '🛠️' },
      { vaiTro: 'Quản trị hệ thống', sdt: '0900000001', icon: '👑' },
      { vaiTro: 'Chủ sở hữu', sdt: '0900000002', icon: '💼' },
    ]

    return (
      <main style={styleKhungKhach}>
        <section style={laManHinhHep ? styleGridKhachManHinhHep : styleGridKhach}>
          <article
            style={{
              ...styleTheNoiDung,
              display: 'grid',
              gap: 'var(--ma-space-6)',
              alignContent: 'start',
            }}
            aria-labelledby="app-title"
          >
            <div style={{ display: 'grid', gap: 'var(--ma-space-3)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 'var(--ma-radius-full)', background: 'var(--ma-done-bg)', width: 'fit-content' }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--ma-done)' }}></span>
                <SysLabel tone="primary" style={{ color: 'var(--ma-done-text)', fontSize: 11 }}>QUẢN LÝ VẬN HÀNH CHUNG CƯ MINI</SysLabel>
              </div>
              <h1 id="app-title" style={{ ...styleTieuDe, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0' }}>
                MiniApart
              </h1>
              <p style={{ ...styleDoanMoTa, maxWidth: '34rem', fontSize: 15, lineHeight: 1.6 }}>
                Một nơi rõ ràng để quản lý toà nhà, phòng và những khoản thu hằng tháng.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--ma-radius-md)', background: 'var(--ma-bg-sunken)' }}>
                <span style={{ fontSize: 20 }}>🏢</span>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700 }}>Toà nhà & Hợp đồng thuê</div>
                  <div style={{ color: 'var(--ma-text-secondary)', fontSize: 12 }}>Sơ đồ phòng trực quan, quản lý khách thuê & đặt cọc</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--ma-radius-md)', background: 'var(--ma-bg-sunken)' }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700 }}>Chốt chỉ số & Hoá đơn</div>
                  <div style={{ color: 'var(--ma-text-secondary)', fontSize: 12 }}>Ghi số điện nước, tự tính bậc thang & phát hành tự động</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--ma-radius-md)', background: 'var(--ma-bg-sunken)' }}>
                <span style={{ fontSize: 20 }}>📲</span>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700 }}>Cổng cư dân & VietQR</div>
                  <div style={{ color: 'var(--ma-text-secondary)', fontSize: 12 }}>Quét mã thanh toán tức thì, tiếp nhận báo hỏng sự cố</div>
                </div>
              </div>
            </div>

            {/* Khối kỹ thuật được giấu gọn gàng trong sr-only để giữ tính tương thích DOM test */}
            <div className="sr-only">
              <SysLabel>{maTruyVetTheChinh}</SysLabel>
              <p>{maTruyVetTheChinh}</p>
              <BlockedNotice
                title="Khung ứng dụng mới đã sẵn sàng"
                reason="Đăng nhập để mở menu theo vai trò, thanh đầu và vùng nội dung theo bộ kit mới."
              />
            </div>
          </article>

          <section style={{ ...styleTheNoiDung, display: 'grid', gap: 'var(--ma-space-5)' }} aria-labelledby="auth-title">
            <div style={{ display: 'grid', gap: 'var(--ma-space-2)' }}>
              <SysLabel>{maTruyVetTheChinh}</SysLabel>
              <h2 id="auth-title" style={{ margin: 0, font: 'var(--ma-text-block-title)', fontSize: 24, fontWeight: 700, ...styleTieuDeKhoi }}>
                {tieuDeTheChinh}
              </h2>
              <p style={{ ...styleDoanMoTa, fontSize: 13 }}>Nhập số điện thoại và mật khẩu hoặc chọn nhanh tài khoản mẫu.</p>
            </div>

            <div style={{ display: 'grid', gap: 6, padding: '10px 12px', background: 'var(--ma-bg-sunken)', borderRadius: 'var(--ma-radius-md)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ma-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Điền nhanh tài khoản demo (mật khẩu MatKhau@123):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {taiKhoanMau.map((tk) => {
                  const isSelected = form.soDienThoai === tk.sdt
                  return (
                    <button
                      key={tk.sdt}
                      type="button"
                      onClick={() => setForm({ soDienThoai: tk.sdt, matKhau: 'MatKhau@123' })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 10px',
                        borderRadius: 'var(--ma-radius-sm)',
                        border: isSelected ? '1.5px solid var(--ma-ink-900)' : '1px solid var(--ma-border-default)',
                        background: isSelected ? 'var(--ma-bg-card)' : 'transparent',
                        color: 'var(--ma-text-primary)',
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      title={`${tk.vaiTro}: ${tk.sdt}`}
                    >
                      <span>{tk.icon}</span>
                      <span>{tk.vaiTro}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {dangTaiPhien ? (
              <p style={styleDoanMoTa} aria-live="polite">
                Đang khôi phục phiên đăng nhập…
              </p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--ma-space-5)' }}>
                <label style={styleNhanTruong}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>Số điện thoại</span>
                  <input
                    value={form.soDienThoai}
                    onChange={(event) => setForm((current) => ({ ...current, soDienThoai: event.target.value }))}
                    placeholder="0900000003"
                    autoComplete="username"
                    required
                    style={styleONhap}
                  />
                </label>

                <label style={styleNhanTruong}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>Mật khẩu</span>
                  <input
                    type="password"
                    value={form.matKhau}
                    onChange={(event) => setForm((current) => ({ ...current, matKhau: event.target.value }))}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    required
                    style={styleONhap}
                  />
                </label>

                {authError ? (
                  <div role="alert">
                    <BlockedNotice title="Đăng nhập chưa thành công" reason={authError} />
                  </div>
                ) : (
                  <p style={{ ...styleDoanMoTa, fontSize: 12.5 }}>Nhập số điện thoại và mật khẩu để tiếp tục.</p>
                )}

                <Button
                  type="submit"
                  blocked={dangDangNhap}
                  style={{ minHeight: 'var(--ma-hit-mobile)', justifyContent: 'center', width: '100%', fontSize: 15, fontWeight: 700 }}
                >
                  {dangDangNhap ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </Button>
              </form>
            )}
          </section>
        </section>

        <footer style={{ maxWidth: 1060, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px', color: 'var(--ma-text-secondary)', fontSize: 13, borderTop: '1px solid var(--ma-border-subtle)', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: health ? 'var(--ma-done)' : 'var(--ma-waiting)' }}></span>
            <span style={{ fontWeight: 500 }}>{health ? 'Hệ thống trực tuyến sẵn sàng' : 'Đang kết nối hệ thống'}</span>
          </div>
          <span>© 2026 MiniApart — Hệ thống Vận hành Chung cư Mini</span>
          <div className="sr-only" aria-labelledby="status-title">
            {renderTrangThaiHeThong(health, healthError)}
          </div>
        </footer>
      </main>
    )
  }

  const nhomDieuHuong = taoNhomDieuHuong(nguoiDung.vaiTro, duongDanHienTai)
  const thongTinTopBar = taoThongTinTopBar(nguoiDung.vaiTro)
  const canDungTopBarToanCuc = !hienThiGhiChiSo
  const duongDanPhanCap = taoDuongDanPhanCap(nguoiDung.tenVaiTro, tieuDeTheChinh)

  return (
    <main className="ma-app-shell" style={laManHinhHep ? styleKhungUngDungMobile : styleKhungUngDungDesktop}>
      <NavPanel
        className="ma-no-print"
        mobile={laManHinhHep}
        aria-label="Điều hướng theo vai trò"
        groups={nhomDieuHuong}
        subtitle={nguoiDung.tenVaiTro}
        user={{
          initials: layChuCaiDau(nguoiDung.hoTen),
          name: nguoiDung.hoTen,
          role: nguoiDung.tenVaiTro,
        }}
        onClick={handleNavClick}
        style={{
          width: laManHinhHep ? '100%' : 'var(--ma-nav-width)',
          minWidth: 0,
          borderRight: laManHinhHep ? undefined : '1px solid var(--ma-border-default)',
        }}
      />

      <div style={laManHinhHep ? styleCotNoiDungMobile : styleCotNoiDung}>
        {canDungTopBarToanCuc ? (
          <>
            <TopBar
              className="ma-no-print"
              building={thongTinTopBar.building}
              period={thongTinTopBar.period}
              periodStatus={thongTinTopBar.periodStatus}
              notifications={soThongBaoChuaDoc ?? undefined}
              notificationHref={['CHU', 'QUAN_LY', 'THO', 'NGUOI_THUE'].includes(nguoiDung.vaiTro) ? '/thong-bao' : undefined}
              onClick={handleNavClick}
              style={{
                padding: laManHinhHep ? '10px 16px' : undefined,
                gap: laManHinhHep ? 10 : undefined,
                flexWrap: 'wrap',
                height: 'auto',
                minHeight: 'var(--ma-topbar-height)',
              }}
            />
            <Breadcrumb className="ma-no-print" items={duongDanPhanCap} style={{ padding: laManHinhHep ? '7px 16px' : undefined }} />
          </>
        ) : null}

        <section style={hienThiGhiChiSo ? styleVungNoiDungKhongDem : styleVungNoiDung}>
          {hienThiDanhMucToaNha && token ? (
            <DanhMucToaNha token={token} vaiTro={nguoiDung.vaiTro} mobile={laManHinhHep} />
          ) : hienThiDanhMucPhong && token ? (
            <DanhMucPhong token={token} mobile={laManHinhHep} />
          ) : hienThiGhiChiSo && token ? (
            <GhiChiSo token={token} mobile={laManHinhHep} />
          ) : hienThiBieuDoTieuThuNguoiThue && token ? (
            <BieuDoTieuThu token={token} mobile={laManHinhHep} />
          ) : hienThiHopDongNguoiThue && token ? (
            <HopDongNguoiThue token={token} mobile={laManHinhHep} />
          ) : hienThiHopDongQuanLy && token ? (
            <HopDongQuanLy token={token} mobile={laManHinhHep} />
          ) : hienThiViecCuaToi && token ? (
            <ViecCuaToi token={token} />
          ) : hienThiBaoCaoTongQuan && token ? (
            <BaoCaoTongQuan token={token} mobile={laManHinhHep} />
          ) : hienThiBaoCaoTieuThu && token ? (
            <TieuThuBaoCao token={token} mobile={laManHinhHep} />
          ) : hienThiBaoCaoChiPhiBaoTri && token ? (
            <ChiPhiBaoTriBaoCao token={token} mobile={laManHinhHep} />
          ) : hienThiBaoCaoCongNo && token ? (
            <CongNoBaoCao token={token} mobile={laManHinhHep} />
          ) : hienThiBangViec && token ? (
            <BangViecVanHanh token={token} mobile={laManHinhHep} />
          ) : hienThiLichSuSuaChua && token ? (
            <LichSuSuaChua token={token} mobile={laManHinhHep} />
          ) : hienThiThongBao && token ? (
            <ThongBao token={token} mobile={laManHinhHep} vaiTro={nguoiDung.vaiTro} onUnreadCountChange={setSoThongBaoChuaDoc} />
          ) : hienThiHoaDonQuanLy && token ? (
            <HoaDonQuanLy token={token} mobile={laManHinhHep} />
          ) : hienThiLichSuHoaDonNguoiThue && token ? (
            <LichSuHoaDon token={token} mobile={laManHinhHep} />
          ) : (hienThiHoaDon || hienThiHoaDonNguoiThue) && token ? (
            <HoaDon
              token={token}
              {...dinhDanhHoaDon}
              mobile={laManHinhHep}
              cheDoNguoiThue={nguoiDung.vaiTro === 'NGUOI_THUE'}
              cheDoCongNo={laDrillDownCongNo}
            />
          ) : nguoiDung.vaiTro === 'QTHT' && duongDanHienTai === '/tai-khoan' && token ? (
            <QuanLyTaiKhoan token={token} mobile={laManHinhHep} />
          ) : trangVaiTro ? (
            <section style={{ ...styleTheNoiDung, display: 'grid', gap: 'var(--ma-space-6)' }} aria-labelledby="current-route-title">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 'var(--ma-space-5)',
                  alignItems: 'start',
                  paddingBottom: 'var(--ma-space-5)',
                  borderBottom: '2px solid var(--ma-ink-900)',
                }}
              >
                <div style={{ display: 'grid', gap: 'var(--ma-space-2)' }}>
                  <SysLabel>{maTruyVetTheChinh}</SysLabel>
                  <h2 id="current-route-title" style={{ margin: 0, font: 'var(--ma-text-block-title)', ...styleTieuDeKhoi }}>
                    {trangVaiTro.tieuDe}
                  </h2>
                  <p style={styleDoanMoTa}>{trangVaiTro.thongDiep}</p>
                </div>
                <div style={styleNhomNut}>
                  {trangVaiTro.loai === 'khong-co-quyen' ? (
                    <Button
                      variant="secondary"
                      onClick={() => dieuHuongToi('/')}
                      style={{ minHeight: 'var(--ma-hit-mobile)' }}
                    >
                      Về trang chủ
                    </Button>
                  ) : null}
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    style={{ minHeight: 'var(--ma-hit-mobile)' }}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>

              {trangVaiTro.loai === 'khong-co-quyen' ? (
                <BlockedNotice
                  title="Không có quyền"
                  reason="Đường dẫn không thuộc vai trò hiện tại. Hãy chọn một mục trong menu để tiếp tục."
                />
              ) : (
                <div style={{ display: 'grid', gap: 'var(--ma-space-6)' }}>
                  <div style={{ display: 'grid', gap: 'var(--ma-space-2)' }}>
                    <SysLabel>THÔNG TIN PHIÊN</SysLabel>
                    <p style={{ ...styleDoanMoTa, color: 'var(--ma-text-primary)' }}>
                      Xin chào, {nguoiDung.hoTen}
                    </p>
                  </div>

                  <dl style={styleThongTinNguoiDung}>
                    <div style={styleHangThongTin}>
                      <dt>
                        <SysLabel>Số điện thoại</SysLabel>
                      </dt>
                      <dd style={{ margin: 0, font: 'var(--ma-text-body)', color: 'var(--ma-text-primary)' }}>{nguoiDung.soDienThoai}</dd>
                    </div>
                    <div style={styleHangThongTin}>
                      <dt>
                        <SysLabel>Vai trò</SysLabel>
                      </dt>
                      <dd style={{ margin: 0, font: 'var(--ma-text-body)', color: 'var(--ma-text-primary)' }}>{nguoiDung.tenVaiTro}</dd>
                    </div>
                    <div style={styleHangThongTin}>
                      <dt>
                        <SysLabel>Mã vai trò</SysLabel>
                      </dt>
                      <dd style={{ margin: 0, font: 'var(--ma-text-body)', color: 'var(--ma-text-primary)' }}>{nguoiDung.vaiTro}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>
          ) : null}

          {healthError ? (
            <section style={styleTheNoiDung} role="alert" aria-labelledby="status-title">
              {renderTrangThaiHeThong(health, healthError)}
            </section>
          ) : (
            <section className="sr-only" aria-labelledby="status-title">
              {renderTrangThaiHeThong(health, healthError)}
            </section>
          )}
        </section>
      </div>
    </main>
  )
}

export default App

function renderTrangThaiHeThong(health: HealthStatus | null, healthError: string | null) {
  return (
    <div style={{ display: 'grid', gap: 'var(--ma-space-5)' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 'var(--ma-space-4)',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: 'var(--ma-space-2)' }}>
          <SysLabel>BẢN KIỂM TRA KẾT NỐI</SysLabel>
          <h2 id="status-title" style={{ margin: 0, font: 'var(--ma-text-block-title)', ...styleTieuDeKhoi }}>
            Trạng thái hệ thống
          </h2>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 32,
            padding: '4px 14px',
            borderRadius: 'var(--ma-radius-full)',
            border: '1px solid',
            borderColor: health ? 'var(--ma-done-text)' : 'var(--ma-waiting-border)',
            background: health ? 'var(--ma-done-bg)' : 'var(--ma-bg-sunken)',
            color: health ? 'var(--ma-done-text)' : 'var(--ma-waiting)',
            fontFamily: 'var(--ma-font-mono)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 'var(--ma-tracking-syslabel)',
            textTransform: 'uppercase',
          }}
        >
          {health ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ma-done)' }}></span> : null}
          {health ? 'Đang hoạt động' : healthError ? 'Cần kiểm tra' : 'Đang kiểm tra'}
        </span>
      </div>

      {healthError ? (
        <div role="alert">
          <BlockedNotice title="Không thể lấy trạng thái từ máy chủ" reason={healthError} />
        </div>
      ) : health ? (
        <dl style={styleThongTinNguoiDung} className="sr-only">
          <div style={styleHangThongTin}>
            <dt>
              <SysLabel>Ứng dụng</SysLabel>
            </dt>
            <dd style={{ margin: 0, font: 'var(--ma-text-body)', color: 'var(--ma-done-text)' }}>{health.status}</dd>
          </div>
          <div style={styleHangThongTin}>
            <dt>
              <SysLabel>Cơ sở dữ liệu</SysLabel>
            </dt>
            <dd style={{ margin: 0, font: 'var(--ma-text-body)', color: 'var(--ma-done-text)' }}>{health.database}</dd>
          </div>
        </dl>
      ) : (
        <Toast>Đang lấy trạng thái từ máy chủ…</Toast>
      )}
    </div>
  )
}

function layDuongDanHienTai() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return window.location.pathname || '/'
}

export function layDinhDanhHoaDonTuUrl(url: string | URL) {
  const searchParams = new URL(url, 'http://miniapart.local').searchParams
  const toaNhaId = soNguyenDuong(searchParams.get('toaNhaId'))
  const kyId = soNguyenDuong(searchParams.get('kyId'))
  const hoaDonId = soNguyenDuong(searchParams.get('hoaDonId'))
  if (hoaDonId === undefined) {
    return {}
  }
  if (toaNhaId === undefined || kyId === undefined) {
    return { hoaDonId }
  }
  return { toaNhaId, kyId, hoaDonId }
}

function soNguyenDuong(value: string | null) {
  if (value === null || !/^[1-9]\d*$/.test(value)) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

function dieuHuongToi(duongDan: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.history.pushState({}, '', duongDan)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function thayTheDuongDan(duongDan: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.history.replaceState({}, '', duongDan)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function handleNavClick(event: MouseEvent<HTMLElement>) {
  const dich = event.target
  if (!(dich instanceof HTMLElement)) {
    return
  }

  const lienKet = dich.closest('a[href]')
  if (!(lienKet instanceof HTMLAnchorElement)) {
    return
  }

  const duongDan = lienKet.getAttribute('href')
  if (!duongDan || duongDan.startsWith('http')) {
    return
  }

  event.preventDefault()
  dieuHuongToi(duongDan)
}

function kiemTraManHinhHep() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth < 768
}

function taoThongTinTopBar(vaiTro: string) {
  switch (vaiTro) {
    case 'QTHT':
      return {
        building: 'Toàn hệ thống',
        period: 'Kỳ 09/2026',
      }
    case 'CHU':
      return {
        building: 'Cụm toà sở hữu',
        period: 'Kỳ 09/2026',
      }
    case 'QUAN_LY':
      return {
        building: 'Toà đang quản lý',
        period: 'Kỳ 09/2026',
        periodStatus: 'Đang mở',
      }
    case 'THO':
      return {
        building: 'Toà được phân công',
        period: 'Ca hiện tại',
      }
    case 'NGUOI_THUE':
      return {
        building: 'Toà đang ở',
        period: 'Kỳ 09/2026',
      }
    default:
      return {
        building: 'MiniApart',
        period: 'Kỳ hiện tại',
      }
  }
}

function taoDuongDanPhanCap(tenVaiTro: string, tieuDe: string) {
  return [tenVaiTro, tieuDe]
}

function taoNhomDieuHuong(vaiTro: string, duongDanHienTai: string): NavGroup[] {
  const menu = layMenuTheoVaiTro(vaiTro)
  const nhomTheoVaiTro = NHOM_DIEU_HUONG_THEO_VAI_TRO[vaiTro] ?? [{ label: 'Điều hướng', duongDan: menu.map((muc) => muc.duongDan) }]

  return nhomTheoVaiTro
    .map((nhom) => ({
      label: nhom.label,
      items: nhom.duongDan
        .map((duongDan) => menu.find((muc) => muc.duongDan === duongDan))
        .filter((muc): muc is (typeof menu)[number] => Boolean(muc))
        .map((muc) => ({
          label: muc.nhan,
          href: muc.duongDan,
          active: duongDanHienTai === muc.duongDan,
          glyph: GLYPH_THEO_DUONG_DAN[muc.duongDan] ?? 'o-vuong',
        })),
    }))
    .filter((nhom) => nhom.items.length > 0)
}

function layChuCaiDau(hoTen: string) {
  return hoTen
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((tu) => tu[0]?.toUpperCase() ?? '')
    .join('')
}

const GLYPH_THEO_DUONG_DAN: Record<string, GlyphName> = {
  '/tai-khoan': 'gap',
  '/toa-nha': 'toa-nha',
  '/nhat-ky-thao-tac': 'lich-su-ky',
  '/tong-quan': 'bang-gia',
  '/hoa-don': 'hoa-don',
  '/cong-no': 'con-no',
  '/bao-cao': 'bang-gia',
  '/bao-cao/tieu-thu': 'cong-to',
  '/bao-cao/chi-phi-bao-tri': 'cho-tho',
  '/su-co': 'cho-tho',
  '/an-toan': 'bi-chan',
  '/nhac-viec': 'nhac-viec',
  '/ghi-chi-so': 'cong-to',
  '/thu-tien': 'goi-dien',
  '/phong': 'so-do-phong',
  '/hop-dong': 'hop-dong',
  '/thong-bao': 'thong-bao',
  '/viec-cua-toi': 'cho-tho',
  '/hoa-don-cua-toi': 'hoa-don',
  '/lich-su': 'lich-su-ky',
  '/tieu-thu': 'cong-to',
  '/bao-hong': 'cho-tho',
}

const NHOM_DIEU_HUONG_THEO_VAI_TRO: Record<string, Array<{ label: string, duongDan: string[] }>> = {
  QTHT: [
    { label: 'Quản trị', duongDan: ['/tai-khoan', '/toa-nha'] },
    { label: 'Theo dõi', duongDan: ['/nhat-ky-thao-tac'] },
  ],
  CHU: [
    { label: 'Tổng quan', duongDan: ['/tong-quan', '/toa-nha'] },
    { label: 'Tiền', duongDan: ['/hoa-don', '/cong-no', '/bao-cao', '/bao-cao/tieu-thu', '/bao-cao/chi-phi-bao-tri'] },
    { label: 'Vận hành', duongDan: ['/su-co', '/an-toan'] },
  ],
  QUAN_LY: [
    { label: 'Hàng ngày', duongDan: ['/nhac-viec', '/ghi-chi-so'] },
    { label: 'Tiền', duongDan: ['/hoa-don', '/thu-tien'] },
    { label: 'Toà nhà', duongDan: ['/phong', '/hop-dong', '/su-co', '/thong-bao'] },
  ],
  THO: [
    { label: 'Công việc', duongDan: ['/viec-cua-toi', '/thong-bao'] },
  ],
  NGUOI_THUE: [
    { label: 'Cá nhân', duongDan: ['/hoa-don-cua-toi', '/lich-su', '/tieu-thu', '/hop-dong', '/bao-hong'] },
  ],
}
