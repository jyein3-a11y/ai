/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Step,
  OperatingMode,
  ServiceItem,
  StaffMember,
  Reservation,
  VisitRecord
} from './types';
import {
  SYSTEM_SERVICES,
  INITIAL_STAFF_LIST,
  REGISTERED_CLIENTS,
  INITIAL_RESERVATIONS,
  INITIAL_VISIT_HISTORY,
  AVAILABLE_DATES,
  AVAILABLE_TIMES_MAP,
  OFFICIAL_CONTACTS
} from './data/systemData';
import { speechService } from './utils/speech';
import { OperatingStatus, getOperatingStatus } from './utils/operatingHours';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InactivityModal } from './components/InactivityModal';
import { StaffCallModal } from './components/StaffCallModal';

// Steps
import { WelcomeStep } from './components/steps/WelcomeStep';
import { ConsentStep } from './components/steps/ConsentStep';
import { MainMenuStep } from './components/steps/MainMenuStep';
import { ServiceSelectStep } from './components/steps/ServiceSelectStep';
import { ServiceDocsStep } from './components/steps/ServiceDocsStep';
import { StaffCheckStep } from './components/steps/StaffCheckStep';
import { StaffCallStep } from './components/steps/StaffCallStep';
import { StaffSmsStep } from './components/steps/StaffSmsStep';
import { EmergencyStep } from './components/steps/EmergencyStep';
import { ReservationStep } from './components/steps/ReservationStep';
import { ReservationManageStep } from './components/steps/ReservationManageStep';
import { DeskGuidanceStep } from './components/steps/DeskGuidanceStep';
import { SystemErrorStep } from './components/steps/SystemErrorStep';
import { LandingPage } from './components/LandingPage';

export default function App() {
  // Navigation & Step State: Initial screen is the engaging Landing Page
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [stepHistory, setStepHistory] = useState<Step[]>([]);

  // Operational State & Dynamic Operating Hours Calculation
  const [manualModeOverride, setManualModeOverride] = useState<OperatingMode | null>(null);
  const [operatingStatus, setOperatingStatus] = useState<OperatingStatus>(() => getOperatingStatus(null));

  useEffect(() => {
    const updateStatus = () => {
      setOperatingStatus(getOperatingStatus(manualModeOverride));
    };
    updateStatus();
    const interval = setInterval(updateStatus, 15000);
    return () => clearInterval(interval);
  }, [manualModeOverride]);

  // If manually toggled for testing, use that; otherwise use real-time schedule determination
  const mode: OperatingMode = manualModeOverride ?? (operatingStatus.isBusiness ? 'business' : 'after_hours');
  const isBusiness = operatingStatus.isBusiness;
  const [isConsented, setIsConsented] = useState<boolean>(false);

  // Accessibility State
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Crisis Persistence State (7-2: 이 화면이 뜬 이후에는 대상자가 다른 메뉴로 돌아가도 화면 하단에 유지)
  const [crisisBannerActive, setCrisisBannerActive] = useState<boolean>(false);

  // Gemini API Key in-memory session state (Never stored in localStorage/DB, destroyed on session end / tab close)
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isKeyVerified, setIsKeyVerified] = useState<boolean>(false);

  // Modal States
  const [showInactivityModal, setShowInactivityModal] = useState<boolean>(false);
  const [showStaffCallModal, setShowStaffCallModal] = useState<boolean>(false);

  // Data States
  const [services] = useState<ServiceItem[]>(SYSTEM_SERVICES);
  const [staffList] = useState<StaffMember[]>(INITIAL_STAFF_LIST);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [serviceSelectIntent, setServiceSelectIntent] = useState<'guide' | 'docs'>('guide');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [visitHistory, setVisitHistory] = useState<VisitRecord[]>(INITIAL_VISIT_HISTORY);

  // 60-Second Inactivity Tracker
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Only track if not currently showing modal and not on landing page
    if (currentStep === 'landing') return;
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityModal(true);
      speechService.speak('오랫동안 화면을 누르지 않으셨습니다. 계속 이용하시겠습니까?');
    }, 60000); // 60 seconds
  }, [currentStep]);

  // Global user activity listener
  useEffect(() => {
    const handleActivity = () => {
      if (!showInactivityModal) {
        resetInactivityTimer();
      }
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [resetInactivityTimer, showInactivityModal]);

  // Accessibility: Dynamic Font Size Scaling on Document Root
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'large' || fontSize === 'xlarge') {
      root.style.fontSize = '19.5px';
      root.classList.add('font-large');
      root.classList.remove('font-normal');
    } else {
      root.style.fontSize = '16px';
      root.classList.add('font-normal');
      root.classList.remove('font-large');
    }
  }, [fontSize]);

  // Accessibility: Font Size Class on Root
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
      case 'xlarge':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Step Navigation Helpers
  const goToStep = (nextStep: Step) => {
    setStepHistory((prev) => [...prev, currentStep]);
    setCurrentStep(nextStep);
  };

  const goBack = () => {
    if (stepHistory.length > 0) {
      const prevStep = stepHistory[stepHistory.length - 1];
      setStepHistory((prev) => prev.slice(0, -1));
      setCurrentStep(prevStep);
    } else {
      setCurrentStep(isConsented ? 'main_menu' : 'welcome');
    }
  };

  const goHome = () => {
    setStepHistory([]);
    setCurrentStep(isConsented ? 'main_menu' : 'welcome');
  };

  // Session Reset (이용 종료 / 타임아웃)
  const handleSessionReset = useCallback(() => {
    setShowInactivityModal(false);
    setIsConsented(false);
    setSelectedService(null);
    setSelectedStaff(null);
    setCrisisBannerActive(false);
    setServiceSelectIntent('guide');
    setStepHistory([]);
    setCurrentStep('welcome');
    speechService.stop();
  }, []);

  // TTS Toggle
  const handleToggleTts = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    speechService.setEnabled(next);
    if (next) {
      speechService.speak('음성 읽어주기 기능이 켜졌습니다.');
    } else {
      speechService.stop();
    }
  };

  // If user is viewing the high-converting Landing Page
  if (currentStep === 'landing') {
    return (
      <LandingPage
        operatingStatus={operatingStatus}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((c) => !c)}
        onStartKiosk={() => {
          setStepHistory([]);
          setCurrentStep('welcome');
        }}
        geminiApiKey={geminiApiKey}
        isKeyVerified={isKeyVerified}
        onKeyVerified={(key) => {
          setGeminiApiKey(key);
          setIsKeyVerified(true);
        }}
        onResetKey={() => {
          setGeminiApiKey('');
          setIsKeyVerified(false);
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 font-sans ${getFontSizeClass()} ${
        highContrast
          ? 'bg-black text-yellow-300 antialiased selection:bg-yellow-400 selection:text-black'
          : 'bg-[#F3F7FF] text-[#1E293B] antialiased'
      }`}
    >
      {/* Global Header */}
      <Header
        mode={mode}
        operatingMode={mode}
        operatingStatus={operatingStatus}
        ttsEnabled={ttsEnabled}
        highContrast={highContrast}
        fontSize={fontSize}
        onToggleMode={() => setManualModeOverride(mode === 'business' ? 'after_hours' : 'business')}
        onToggleOperatingMode={() => setManualModeOverride(mode === 'business' ? 'after_hours' : 'business')}
        onToggleTts={handleToggleTts}
        onToggleHighContrast={() => setHighContrast((c) => !c)}
        onChangeFontSize={setFontSize}
        onCycleFontSize={() => setFontSize((s) => (s === 'normal' ? 'large' : 'normal'))}
        onEndSession={handleSessionReset}
        onGoToLanding={() => {
          speechService.stop();
          setCurrentStep('landing');
        }}
        isKeyVerified={isKeyVerified}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-start">
        {/* Step 0: Welcome & Greetings (인사 및 서비스 시작하기 버튼 화면) */}
        {currentStep === 'welcome' && (
          <WelcomeStep
            highContrast={highContrast}
            operatingStatus={operatingStatus}
            onStartService={() => goToStep('consent')}
            onViewLanding={() => {
              speechService.stop();
              setCurrentStep('landing');
            }}
          />
        )}

        {/* Step 1: Consent & Privacy Agreement */}
        {currentStep === 'consent' && (
          <ConsentStep
            mode={mode}
            highContrast={highContrast}
            onAgree={() => {
              setIsConsented(true);
              goToStep('main_menu');
            }}
            onDecline={() => {
              setIsConsented(false);
              goToStep('consent_declined');
            }}
          />
        )}

        {/* Step 1-Declined: 안내 창구 유도 */}
        {currentStep === 'consent_declined' && (
          <DeskGuidanceStep
            highContrast={highContrast}
            onCallDeskBell={() => setShowStaffCallModal(true)}
            onGoHome={() => setCurrentStep('welcome')}
          />
        )}

        {/* Step 2: Main Menu Hub */}
        {currentStep === 'main_menu' && (
          <MainMenuStep
            operatingMode={mode}
            mode={mode}
            operatingStatus={operatingStatus}
            highContrast={highContrast}
            privacyAgreed={isConsented}
            isConsented={isConsented}
            onSelectService={() => {
              setServiceSelectIntent('guide');
              goToStep('service_select');
            }}
            onSelectServiceGuide={() => {
              setServiceSelectIntent('guide');
              goToStep('service_select');
            }}
            onSelectDocs={() => {
              setServiceSelectIntent('docs');
              goToStep('service_select');
            }}
            onContactStaff={() => goToStep('staff_lookup')}
            onSelectStaffCheck={() => goToStep('staff_lookup')}
            onReserve={() => goToStep('reserve_date')}
            onSelectReservation={() => goToStep('reserve_date')}
            onSendSms={() => goToStep('staff_sms')}
            onSelectStaffSms={() => goToStep('staff_sms')}
            onEmergency={() => {
              setCrisisBannerActive(true);
              goToStep('emergency_confirm');
            }}
            onSelectEmergency={() => {
              setCrisisBannerActive(true);
              goToStep('emergency_confirm');
            }}
            onManageReservations={() => goToStep('reserve_list')}
            onSelectManageReservation={() => goToStep('reserve_list')}
            onGoToDesk={() => goToStep('desk_guidance')}
            onSelectCrisisSupport={() => {
              setCrisisBannerActive(true);
              goToStep('crisis_support');
            }}
          />
        )}

        {/* Step 3-1: Service Selection */}
        {currentStep === 'service_select' && (
          <ServiceSelectStep
            services={services}
            highContrast={highContrast}
            intent={serviceSelectIntent}
            onSelectService={(srv) => {
              setSelectedService(srv);
              goToStep('service_docs');
            }}
            onUnknownService={() => {
              // "잘 모르겠어요" -> 직원이 가장 많이 찾는 주거/취업 기본 추천
              setSelectedService(services[0]);
              goToStep('service_docs');
            }}
          />
        )}

        {/* Step 3-2: Service Document Checklist */}
        {currentStep === 'service_docs' && (
          <ServiceDocsStep
            service={selectedService || services[0]}
            operatingMode={mode}
            mode={mode}
            highContrast={highContrast}
            onChangeService={() => {
              setServiceSelectIntent('docs');
              goToStep('service_select');
            }}
            onAllDocsChecked={() => {
              // 서류 확인 완료 -> 상담 예약 또는 직원 연결
              goToStep('reserve_date');
            }}
            onProceedNext={() => {
              goToStep('reserve_date');
            }}
            onCallStaff={() => {
              setShowStaffCallModal(true);
            }}
            onCallStaffForMissing={() => {
              setShowStaffCallModal(true);
            }}
            onProceedToReserve={() => {
              goToStep('reserve_date');
            }}
            onReserveDate={() => {
              goToStep('reserve_date');
            }}
            onProceedToSms={() => {
              goToStep('staff_sms');
            }}
            onSendSms={() => {
              goToStep('staff_sms');
            }}
            onResetToHome={goHome}
            onGoHome={goHome}
          />
        )}

        {/* Step 4: Staff Lookup */}
        {currentStep === 'staff_lookup' && (
          <StaffCheckStep
            staffList={staffList}
            registeredClients={REGISTERED_CLIENTS}
            highContrast={highContrast}
            onCallStaff={(staff) => {
              setSelectedStaff(staff);
              goToStep('staff_call');
            }}
            onSmsStaff={(staff) => {
              setSelectedStaff(staff);
              goToStep('staff_sms');
            }}
            onCallDesk={() => setShowStaffCallModal(true)}
          />
        )}

        {/* Step 5: Staff Call Dialing & Transfer */}
        {currentStep === 'staff_call' && (
          <StaffCallStep
            staff={selectedStaff || staffList[0]}
            availableAlternativeStaff={staffList.find((s) => s.id !== (selectedStaff?.id || 'staff_1') && s.isAvailable)}
            highContrast={highContrast}
            onGoToSms={() => goToStep('staff_sms')}
            onGoHome={goHome}
          />
        )}

        {/* Step 6: Staff SMS Inquiry */}
        {currentStep === 'staff_sms' && (
          <StaffSmsStep
            staff={selectedStaff || undefined}
            highContrast={highContrast}
            onGoToCall={() => {
              if (selectedStaff) {
                goToStep('staff_call');
              } else {
                setShowStaffCallModal(true);
              }
            }}
            onGoHome={goHome}
          />
        )}

        {/* Step 7-1: Emergency Call Confirmation */}
        {currentStep === 'emergency_confirm' && (
          <EmergencyStep
            isCrisisMode={false}
            highContrast={highContrast}
            onCallDesk={() => setShowStaffCallModal(true)}
            onCancel={goHome}
          />
        )}

        {/* Step 7-2: Emotional Crisis Support */}
        {currentStep === 'crisis_support' && (
          <EmergencyStep
            isCrisisMode={true}
            highContrast={highContrast}
            onCallDesk={() => setShowStaffCallModal(true)}
            onCancel={goHome}
          />
        )}

        {/* Step 8, 9, 10: Reservation Booking Flow */}
        {currentStep === 'reserve_date' && (
          <ReservationStep
            availableDates={AVAILABLE_DATES}
            timeSlotsByDate={AVAILABLE_TIMES_MAP}
            staffList={staffList}
            services={services}
            selectedService={selectedService || undefined}
            highContrast={highContrast}
            onReservationCreated={(newRes) => {
              setReservations((prev) => [newRes, ...prev]);
            }}
            onCallDesk={() => setShowStaffCallModal(true)}
            onGoHome={goHome}
          />
        )}

        {/* Step 11, 12, 13: Reservation Management (Change/Cancel/Staff changed) */}
        {currentStep === 'reserve_list' && (
          <ReservationManageStep
            reservations={reservations}
            visitRecords={visitHistory}
            availableDates={AVAILABLE_DATES}
            timeSlotsByDate={AVAILABLE_TIMES_MAP}
            staffList={staffList}
            highContrast={highContrast}
            onUpdateReservation={(updated) => {
              setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
              setVisitHistory((prev) =>
                prev.map((v) =>
                  v.status === 'scheduled'
                    ? {
                        ...v,
                        date: updated.date,
                        serviceName: updated.serviceName,
                        staffName: updated.staffName,
                        location: updated.location
                      }
                    : v
                )
              );
            }}
            onCancelReservation={(resId) => {
              setReservations((prev) => prev.filter((r) => r.id !== resId));
              setVisitHistory((prev) =>
                prev.filter((v) => v.status !== 'scheduled')
              );
            }}
            onCallDesk={() => setShowStaffCallModal(true)}
            onGoHome={goHome}
          />
        )}

        {/* Step: Desk Guidance */}
        {currentStep === 'desk_guidance' && (
          <DeskGuidanceStep
            highContrast={highContrast}
            onCallDeskBell={() => setShowStaffCallModal(true)}
            onGoHome={goHome}
          />
        )}

        {/* Step 14: System Error Fallback */}
        {currentStep === 'system_error' && (
          <SystemErrorStep
            highContrast={highContrast}
            onRetry={() => goHome()}
            onCallDesk={() => setShowStaffCallModal(true)}
            onGoHome={goHome}
          />
        )}
      </main>

      {/* Persistent Crisis Support Banner (7-2 지침 준수: 이 화면이 뜬 이후 다른 메뉴로 돌아가도 화면 하단에 유지) */}
      {crisisBannerActive && currentStep !== 'crisis_support' && (
        <div
          id="persistent-crisis-banner"
          className={`sticky bottom-20 z-30 mx-4 max-w-4xl self-center p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 flex items-center justify-between shadow-2xl animate-fadeIn ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-rose-600 text-white border-rose-700 shadow-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💛</span>
            <div className="text-xs sm:text-base font-black">
              언제든 편안하게 털어놓으셔도 됩니다.
              <span className="hidden sm:inline"> 위기상담전화(109)가 24시간 열려있습니다.</span>
            </div>
          </div>
          <button
            onClick={() => goToStep('crisis_support')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap shadow-lg active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-white text-rose-700 hover:bg-rose-50'
            }`}
          >
            [📞 위기상담 연결]
          </button>
        </div>
      )}

      {/* Global Fixed Footer */}
      <Footer
        showBackButton={currentStep !== 'welcome' && currentStep !== 'consent' && currentStep !== 'main_menu'}
        showHomeButton={currentStep !== 'welcome'}
        highContrast={highContrast}
        operatingMode={mode}
        operatingStatus={operatingStatus}
        isBusiness={isBusiness}
        onBack={goBack}
        onHome={goHome}
        onExit={handleSessionReset}
        onCallStaff={() => setShowStaffCallModal(true)}
      />

      {/* 60s Inactivity Modal (Prompt Mandate) */}
      <InactivityModal
        isOpen={showInactivityModal}
        highContrast={highContrast}
        onContinue={() => {
          setShowInactivityModal(false);
          resetInactivityTimer();
        }}
        onTimeout={handleSessionReset}
      />

      {/* Staff Calling Modal (Business vs After-hours vs Holiday) */}
      <StaffCallModal
        isOpen={showStaffCallModal}
        operatingMode={mode}
        mode={mode}
        operatingStatus={operatingStatus}
        highContrast={highContrast}
        onClose={() => setShowStaffCallModal(false)}
        onNavigateToSms={() => {
          setShowStaffCallModal(false);
          goToStep('staff_sms');
        }}
        onNavigateToReserve={() => {
          setShowStaffCallModal(false);
          goToStep('reserve_date');
        }}
        onGoToSms={() => {
          setShowStaffCallModal(false);
          goToStep('staff_sms');
        }}
        onGoToReservation={() => {
          setShowStaffCallModal(false);
          goToStep('reserve_date');
        }}
      />
    </div>
  );
}
