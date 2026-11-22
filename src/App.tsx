import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { api } from './services/api'
import { SiteLayout } from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import { AboutPage, ServiceDetailPage, ServicesPage } from './pages/InfoPages'
import AdminPage from './admin/AdminPage'
import CustomerAuthPage from './pages/CustomerAuthPage'
import CustomerAccountPage from './pages/CustomerAccountPage'
import BookingLookupPage from './pages/BookingLookupPage'
import GalleryPage from './pages/GalleryPage'
import FaqPage from './pages/FaqPage'
import CustomerPasswordPage from './pages/CustomerPasswordPage'
let lastTrackedPath = ''
function ScrollToTop(){const{pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'})},[pathname]);return null}
function VisitTracker(){const{pathname}=useLocation();useEffect(()=>{if(lastTrackedPath===pathname)return;lastTrackedPath=pathname;if(/^\/(?:account|admin|dashboard|login|register|forgot-password|reset-password|booking\/lookup)(?:\/|$)/.test(pathname))return;try{let visitorId=sessionStorage.getItem('cleanpro-visit-session');if(!visitorId){visitorId=crypto.randomUUID();sessionStorage.setItem('cleanpro-visit-session',visitorId)}const firstPage=!sessionStorage.getItem('cleanpro-referrer-recorded');sessionStorage.setItem('cleanpro-referrer-recorded','1');void api('analytics/track',{method:'POST',body:JSON.stringify({path:pathname,visitor_id:visitorId,referrer:firstPage?document.referrer:''})}).catch(()=>undefined)}catch{return}},[pathname]);return null}
function NotFound(){return <section className="not-found"><span className="eyebrow">PAGE NOT FOUND</span><h1>This page took a <em>wrong turn.</em></h1><p>The link may have changed or the page is no longer available.</p><a className="button button-dark" href="/">Return home</a></section>}
export default function App(){return <><ScrollToTop/><VisitTracker/><Routes><Route element={<SiteLayout/>}><Route index element={<HomePage/>}/><Route path="services" element={<ServicesPage/>}/><Route path="services/:slug" element={<ServiceDetailPage/>}/><Route path="about" element={<AboutPage/>}/><Route path="contact" element={<ContactPage/>}/><Route path="gallery" element={<GalleryPage/>}/><Route path="faq" element={<FaqPage/>}/><Route path="booking" element={<BookingPage/>}/><Route path="*" element={<NotFound/>}/></Route><Route path="dashboard" element={<AdminPage/>}/><Route path="admin" element={<AdminPage/>}/><Route path="login" element={<CustomerAuthPage mode="login"/>}/><Route path="register" element={<CustomerAuthPage mode="register"/>}/><Route path="forgot-password" element={<CustomerPasswordPage mode="forgot"/>}/><Route path="reset-password" element={<CustomerPasswordPage mode="reset"/>}/><Route path="account" element={<CustomerAccountPage/>}/><Route path="booking/lookup" element={<BookingLookupPage/>}/></Routes></>}
