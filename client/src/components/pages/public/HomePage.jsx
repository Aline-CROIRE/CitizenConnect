import { Link } from "react-router-dom"
import styled from "styled-components"

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: white;
  font-weight: 1000;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: var(--secondary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--secondary-light);
    transform: translateY(-2px);
  }
`

const FeaturesSection = styled.section`
  padding: 4rem 0;
`

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 1rem;
`

const FeatureTitle = styled.h3`
  margin-bottom: 1rem;
`

const FeatureDescription = styled.p`
  color: var(--gray);
`

const StatsSection = styled.section`
  background-color: var(--neutral-light);
  padding: 4rem 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  text-align: center;
`

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  color: var(--gray);
  font-weight: 500;
`

const TestimonialsSection = styled.section`
  padding: 4rem 0;
`

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
`

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  color: var(--neutral-dark);
`

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`

const TestimonialAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--gray-light);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
`

const TestimonialInfo = styled.div``

const TestimonialName = styled.div`
  font-weight: 600;
`

const TestimonialRole = styled.div`
  color: var(--gray);
  font-size: 0.9rem;
`

const CtaSection = styled.section`
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const CtaTitle = styled.h2`
  margin-bottom: 1.5rem;
`

const CtaText = styled.p`
  margin-bottom: 2rem;
  opacity: 0.9;
`

const CtaButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: var(--secondary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--neutral-light);
    transform: translateY(-2px);
  }
`

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Your Voice Matters !!!</HeroTitle>
          <HeroSubtitle>
            Submit complaints, track progress, and help improve government services for everyone.
          </HeroSubtitle>
          <HeroButton to="/register">Submit a Complaint</HeroButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>How It Works</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>Submit</FeatureTitle>
            <FeatureDescription>
              Easily submit your complaint or feedback through our user-friendly platform.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Track</FeatureTitle>
            <FeatureDescription>
              Monitor the status of your complaint in real-time as it progresses through the system.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>✅</FeatureIcon>
            <FeatureTitle>Resolve</FeatureTitle>
            <FeatureDescription>
              Receive updates and resolutions directly from the responsible government institutions.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <SectionTitle>Making an Impact</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>5,000+</StatNumber>
            <StatLabel>Complaints Resolved</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>Government Institutions</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Registered Citizens</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>92%</StatNumber>
            <StatLabel>Satisfaction Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <TestimonialsSection>
        <SectionTitle>What Citizens Say</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              "I reported a broken street light in my neighborhood that had been out for months. Within a week of
              submitting my complaint, it was fixed! This platform really works."
            </TestimonialText>
            <TestimonialAuthor>
              <TestimonialAvatar>KA</TestimonialAvatar>
              <TestimonialInfo>
                <TestimonialName>KIM Aline</TestimonialName>
                <TestimonialRole>Citizen</TestimonialRole>
              </TestimonialInfo>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              "As a senior citizen, I was struggling with getting my pension issues resolved. Thanks to this platform, I
              was able to submit my complaint and get a response within days."
            </TestimonialText>
            <TestimonialAuthor>
              <TestimonialAvatar>MA</TestimonialAvatar>
              <TestimonialInfo>
                <TestimonialName>Mary Aline</TestimonialName>
                <TestimonialRole>Retired Teacher</TestimonialRole>
              </TestimonialInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      <CtaSection>
        <CtaContent>
          <CtaTitle>Ready to Make Your Voice Heard?</CtaTitle>
          <CtaText>
            Join thousands of citizens who are helping to improve government services through their feedback and
            complaints.
          </CtaText>
          <CtaButton to="/register">Register Now</CtaButton>
        </CtaContent>
      </CtaSection>
    </>
  )
}

export default HomePage
