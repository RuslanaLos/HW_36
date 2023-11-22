import { Component } from 'react';
import SmileCard from '../SmileCard';
import './Voting.scss';

class Voting extends Component {
    state = {
        candidates: [],
        votes: {},
        results: [],
    };

    handleVote = (id) => {
        this.setState((prevState) => {
            const updatedVotes = { ...prevState.votes };
            updatedVotes[id] = (updatedVotes[id] || 0) + 1;
            return { votes: updatedVotes };
        });
    };

    showResults = () => {
        const { votes } = this.state;
        const sortedResults = Object.entries(votes);
        sortedResults.sort((a, b) => b[1] - a[1]);
        this.setState({ results: sortedResults });
    };


    componentDidMount() {
        fetch('http://localhost:3000/data.json')
            .then((res) => res.json())
            .then((result) => {
                const ids = result.map(item => item.id);
                const initialVotes = new Map(ids.map(id => [id, 0]));
                this.setState({
                    candidates: result,
                    votes: initialVotes,
                });
            });
    }

    render() {
        const { candidates, results } = this.state;
        return (
            <div>
                <h1>Choose the best smile ever:</h1>
                <div className='container'>
                    {candidates.length === 0 && <div>No candidates yet...</div>}
                    {candidates.map((item) => (
                        <div key={item.id}>
                            <SmileCard
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                smile={item.smile}
                                onVote={this.handleVote}
                            />
                            {/*{this.state.votes[item.id]}*/}
                        </div>
                    ))}
                </div>
                <div className={'result'}>
                    <button className={'button'} onClick={this.showResults}>
                        Show Results
                    </button>
                    {results.map(([id, count], index) => {
                        const candidate = candidates.find((item) => item.id === +id);
                        return (
                            <div key={id + index}>
                                <h3>{`Place № ${index + 1} with ${count} votes`}</h3>
                                <SmileCard
                                    id={id}
                                    title={candidate.title}
                                    description={candidate.description}
                                    smile={candidate.smile}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Voting;



