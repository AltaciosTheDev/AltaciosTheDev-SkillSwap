import React, { useEffect, useContext, useState } from 'react'
import { Context } from "../../store/appContext";

import {
  BsNewspaper,
  BsPersonWorkspace,
  BsMortarboardFill,
  BsFillPeopleFill
} from "react-icons/bs";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { TutorCard } from "./TutorCard";
import { SkillCard } from "./SkillCard";

import AchievementCard from "./AchievementCard";
import UpcommingCard from "./UpcommingCard";
import NewsCard from "./NewsCard";
import SwiperComponent from "./SwiperComponent";
import SwiperUpcomming from "./SwiperUpcomming";


export function Main() {
  const { store, actions } = useContext(Context)
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [role, setRole] = useState('');
  const randomCards = []

  useEffect(() => {
    actions.getAssociations(level, role, category)
    actions.getUserSessions() //will always load all sessions in dashboard so pending can have them.
    actions.getAchievements() // will always load all achievements 
    actions.getStatistics()// will always load all statistics 

  }, [])

  if (store.userSkillsAssociations && store.userSkillsAssociations.length > 0) {
    while (randomCards.length < 3) {
      const randomIndex = Math.floor(Math.random() * store.userSkillsAssociations.length);
      const randomCard = store.userSkillsAssociations[randomIndex];
      if (!randomCards.includes(randomCard)) {
        randomCards.push(randomCard);
      }
    }
  }

  console.log(randomCards)

  let randomCardElements = null

  if (randomCards.length > 0) {
    randomCardElements = randomCards.map((association) => (
      <SkillCard
        key={association.user_skill_association_id}
        user_name={association.user_name}
        skill_name={association.skill_name}
        role={association.role}
        level={association.level}
        user_gender={association.user_gender}
        category_name={association.category_name}
        category_image={association.category_image}
        getTutorProfile={() => actions.getTutorProfile(association.user_id)}
        id={association.user_id}
      />
    ));
  }

  return (
    <main className="main-container">
      <div className="left-side">
        <div className="tutors">
          <h4>Recommended</h4>
          <div className="tutor-cards">
            {store.userSkillsAssociations ?
              randomCardElements :
              <>
                <span class="loader"></span>
                <span class="loader"></span>
                <span class="loader"></span>
              </>
            }

          </div>
        </div>
        <div className="statistics">
          <h4>Statistics</h4>
          {store.statistics ? (
            (store.statistics.skill_taught_counts.length === 0 && store.statistics.skill_learned_counts.length === 0) ? (
              <div className="charts">
                <p className='pending-text'>
                  Once you teach or learn a skill, your statistics will appear here as charts!
                </p>
              </div>
            ) : (
              <div className="charts">
                <ResponsiveContainer className="chart" width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={store.statistics.skill_taught_counts}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#82ca9d"
                      name="Skills Tutored"
                      activeBar={<Rectangle fill="gold" stroke="purple" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer className="chart" width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={store.statistics.skill_learned_counts}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Skills Learned"
                      activeBar={<Rectangle fill="pink" stroke="blue" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          ) : (
            <div className="charts">
              <span className="loader"></span>
              <span className="loader"></span>
            </div>
          )}
        </div>
        <div className="achievements">
          <h4>Achievements</h4>
          <div className="achievement-cards">
            <AchievementCard
              title="Sessions Tutored"
              count={store.achievements ? store.achievements.sessions_taught : <span class="loadertwo"></span>}
              icon={<BsPersonWorkspace className="card_icon achievement-icon" />}
            />
            <AchievementCard
              title="Sessions Learned"
              count={store.achievements ? store.achievements.sessions_learned : <span class="loadertwo"></span>}
              icon={<BsMortarboardFill className="card_icon achievement-icon" />}
            />
            <AchievementCard
              title="Users Connected"
              count={store.achievements ? store.achievements.users_connected : <span class="loadertwo"></span>}
              icon={<BsFillPeopleFill className="card_icon achievement-icon" />}
            />

          </div>
        </div>
      </div>
      <div className="right-side">
        <NewsCard />
        <div className="pending">
          <h4>Upcomming</h4>
          <SwiperUpcomming />
        </div>
        <div className="pending">
          <h4>Pending</h4>
          <SwiperComponent />
        </div>
      </div>
    </main>
  );
}

export default Main;
